import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Service = {
  _id: string;
  title: string;
  duration?: number;
};

type Course = {
  _id: string;
  title: string;
};

type Slot = {
  time: string;
  available: boolean;
};

type AvailabilityResponse = {
  branch: string;
  date: string;

  service: {
    id: string;
    title: string;
    duration: number;
  };

  openingTime: string;
  closingTime: string;
  slotInterval: number;

  slots: Slot[];
};

const branches = [
  {
    name: "Teku Branch",
  },
  {
    name: "Chabahil Branch",
  },
  {
    name: "Third Branch",
  },
];

/* ============================================================
   HELPERS
============================================================ */

const getTodayString = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTime = (time: string) => {
  if (!time) return "";

  const [hoursString, minutes] =
    time.split(":");

  const hours = Number(hoursString);

  const period =
    hours >= 12 ? "PM" : "AM";

  const displayHour =
    hours % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
};

const formatDate = (date: string) => {
  if (!date) return "";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Booking() {
  /* ==========================================================
     API DATA
  ========================================================== */

  const [services, setServices] =
    useState<Service[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  /* ==========================================================
     FORM STATE
  ========================================================== */

  const [type, setType] = useState<
    "service" | "course"
  >("service");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [date, setDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  /* ==========================================================
     AVAILABILITY STATE
  ========================================================== */

  const [slots, setSlots] =
    useState<Slot[]>([]);

  const [
    availability,
    setAvailability,
  ] =
    useState<AvailabilityResponse | null>(
      null
    );

  const [
    loadingAvailability,
    setLoadingAvailability,
  ] = useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState("");

  /* ==========================================================
     SUBMIT STATE
  ========================================================== */

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  /* ==========================================================
     FETCH SERVICES + COURSES
  ========================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          servicesResponse,
          coursesResponse,
        ] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/services`
          ),

          fetch(
            `${import.meta.env.VITE_API_URL}/api/courses`
          ),
        ]);

        if (!servicesResponse.ok) {
          throw new Error(
            "Unable to load services."
          );
        }

        if (!coursesResponse.ok) {
          throw new Error(
            "Unable to load courses."
          );
        }

        const servicesData =
          await servicesResponse.json();

        const coursesData =
          await coursesResponse.json();

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : []
        );

        setCourses(
          Array.isArray(coursesData)
            ? coursesData
            : []
        );
      } catch (error) {
        console.error(
          "BOOKING DATA ERROR:",
          error
        );
      }
    };

    loadData();

    /* ========================================================
       RESTORE COURSE SELECTION
       FROM YOUR EXISTING COURSE PAGE
    ======================================================== */

    const savedType =
      localStorage.getItem(
        "bookingType"
      );

    const savedCourse =
      localStorage.getItem(
        "selectedCourse"
      );

    if (savedType === "course") {
      setType("course");
    }

    if (savedCourse) {
      setSelectedItem(savedCourse);
    }

    localStorage.removeItem(
      "bookingType"
    );

    localStorage.removeItem(
      "selectedCourse"
    );
  }, []);

  /* ==========================================================
     FIND SELECTED SERVICE
  ========================================================== */

  const selectedService =
    useMemo(() => {
      return services.find(
        (service) =>
          service._id === selectedItem
      );
    }, [services, selectedItem]);

  /* ==========================================================
     RESET APPOINTMENT WHEN IMPORTANT SELECTION CHANGES
  ========================================================== */

  useEffect(() => {
    setSelectedTime("");
    setSlots([]);
    setAvailability(null);
    setAvailabilityError("");
  }, [
    branch,
    date,
    selectedItem,
    type,
  ]);

  /* ==========================================================
     FETCH REAL AVAILABILITY

     Only runs when:
     - Service booking
     - Service selected
     - Branch selected
     - Date selected
  ========================================================== */

  useEffect(() => {
    if (type !== "service") {
      return;
    }

    if (
      !selectedItem ||
      !branch ||
      !date
    ) {
      return;
    }

    const controller =
      new AbortController();

    const fetchAvailability =
      async () => {
        try {
          setLoadingAvailability(true);

          setAvailabilityError("");

          const params =
            new URLSearchParams({
              branch,
              serviceId:
                selectedItem,
              date,
            });

          const response =
            await fetch(
              `${
                import.meta.env
                  .VITE_API_URL
              }/api/bookings/availability?${params.toString()}`,
              {
                signal:
                  controller.signal,
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load available times."
            );
          }

          setAvailability(data);

          setSlots(
            Array.isArray(data.slots)
              ? data.slots
              : []
          );
        } catch (error) {
          if (
            error instanceof Error &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "AVAILABILITY ERROR:",
            error
          );

          setAvailabilityError(
            error instanceof Error
              ? error.message
              : "Unable to load available times."
          );
        } finally {
          setLoadingAvailability(
            false
          );
        }
      };

    fetchAvailability();

    return () => {
      controller.abort();
    };
  }, [
    type,
    selectedItem,
    branch,
    date,
  ]);

  /* ==========================================================
     AVAILABLE SLOT COUNT
  ========================================================== */

  const availableSlotCount =
    useMemo(() => {
      return slots.filter(
        (slot) => slot.available
      ).length;
    }, [slots]);

  /* ==========================================================
     GROUP SLOTS
  ========================================================== */

  const morningSlots =
    slots.filter((slot) => {
      const hour = Number(
        slot.time.split(":")[0]
      );

      return hour < 12;
    });

  const afternoonSlots =
    slots.filter((slot) => {
      const hour = Number(
        slot.time.split(":")[0]
      );

      return (
        hour >= 12 && hour < 17
      );
    });

  const eveningSlots =
    slots.filter((slot) => {
      const hour = Number(
        slot.time.split(":")[0]
      );

      return hour >= 17;
    });

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setSubmitError("");

    /* ========================================================
       SERVICE VALIDATION
    ======================================================== */

    if (
      type === "service" &&
      !selectedTime
    ) {
      setSubmitError(
        "Please select an available appointment time."
      );

      return;
    }

    setLoading(true);

    try {
      let payload;

      if (type === "service") {
        if (!selectedService) {
          throw new Error(
            "Please select a service."
          );
        }

        payload = {
          name,
          phone,
          email,

          type: "service",

          // Backend receives both.
          // serviceId is used for duration/security.
          serviceId:
            selectedService._id,

          service:
            selectedService.title,

          branch,
          date,

          startTime:
            selectedTime,

          // Temporary compatibility
          // with your existing admin.
          time: selectedTime,
        };
      } else {
        const selectedCourse =
          courses.find(
            (course) =>
              course._id ===
              selectedItem
          );

        payload = {
          name,
          phone,
          email,

          type: "course",

          course:
            selectedCourse?.title ||
            selectedItem,

          branch,
          date,

          time:
            selectedTime || "",
        };
      }

      const response =
        await fetch(
          `${
            import.meta.env
              .VITE_API_URL
          }/api/bookings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        /* ================================================
           409 = another customer got the slot
           before this customer submitted.
        ================================================ */

        if (
          response.status === 409
        ) {
          setSubmitError(
            data.message ||
              "That appointment was just booked. Please choose another time."
          );

          setSelectedTime("");

          // Trigger availability
          // refresh manually.

          if (
            type === "service"
          ) {
            const params =
              new URLSearchParams({
                branch,
                serviceId:
                  selectedItem,
                date,
              });

            const availabilityResponse =
              await fetch(
                `${
                  import.meta.env
                    .VITE_API_URL
                }/api/bookings/availability?${params.toString()}`
              );

            if (
              availabilityResponse.ok
            ) {
              const freshData =
                await availabilityResponse.json();

              setAvailability(
                freshData
              );

              setSlots(
                freshData.slots ||
                  []
              );
            }
          }

          return;
        }

        throw new Error(
          data.message ||
            "Booking failed. Please try again."
        );
      }

      /* ================================================
         SUCCESS
      ================================================ */

      setSuccessMessage(
        type === "service"
          ? "Your appointment request has been submitted successfully."
          : "Your course enrollment has been submitted successfully."
      );

      /* ================================================
         RESET
      ================================================ */

      setName("");
      setPhone("");
      setEmail("");

      setSelectedItem("");
      setBranch("");
      setDate("");
      setSelectedTime("");

      setSlots([]);
      setAvailability(null);

      setType("service");
    } catch (error) {
      console.error(
        "BOOKING SUBMIT ERROR:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     TIME SLOT SECTION
  ========================================================== */

  const renderSlotGroup = (
    label: string,
    groupSlots: Slot[]
  ) => {
    if (groupSlots.length === 0) {
      return null;
    }

    return (
      <div>
        <p
          className="
            mb-3
            text-[9px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#8A6F78]
          "
        >
          {label}
        </p>

        <div
          className="
            grid
            grid-cols-3
            gap-2

            min-[400px]:grid-cols-4

            sm:grid-cols-5

            md:grid-cols-6
          "
        >
          {groupSlots.map(
            (slot) => {
              const isSelected =
                selectedTime ===
                slot.time;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={
                    !slot.available
                  }
                  onClick={() =>
                    setSelectedTime(
                      slot.time
                    )
                  }
                  className={`
                    relative
                    rounded-xl
                    border
                    px-2
                    py-3
                    text-[11px]
                    font-medium
                    transition-all
                    duration-200

                    sm:text-xs

                    ${
                      isSelected
                        ? `
                          border-[#E75480]
                          bg-[#E75480]
                          text-white
                          shadow-[0_7px_18px_rgba(231,84,128,0.22)]
                        `
                        : slot.available
                        ? `
                          border-[#E75480]/15
                          bg-white
                          text-[#3A2A2F]

                          hover:border-[#E75480]
                          hover:bg-[#FFF5F8]
                          hover:text-[#E75480]
                        `
                        : `
                          cursor-not-allowed
                          border-[#3A2A2F]/5
                          bg-[#F4F1F2]
                          text-[#B8AAAF]
                          line-through
                          opacity-60
                        `
                    }
                  `}
                >
                  {formatTime(
                    slot.time
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    );
  };

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-[#FFF5F8]
        px-4
        pb-20
        pt-[100px]
        text-[#3A2A2F]

        sm:px-6
        sm:pt-[110px]

        md:px-10

        lg:px-12
        lg:pb-24
        lg:pt-[120px]
      "
    >
      <section
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* ====================================================
            PAGE HEADING
        ==================================================== */}

        <div
          className="
            mx-auto
            mb-10
            max-w-2xl
            text-center

            sm:mb-12
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span
              className="
                hidden
                h-px
                w-8
                bg-[#E75480]/40
                sm:block
              "
            />

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[4px]
                text-[#E75480]

                sm:text-[10px]
              "
            >
              Book Now
            </p>

            <span
              className="
                hidden
                h-px
                w-8
                bg-[#E75480]/40
                sm:block
              "
            />
          </div>

          <h1
            className="
              mt-4
              font-serif
              text-[40px]
              font-light
              leading-[1.05]

              sm:text-[48px]

              md:text-[54px]
            "
          >
            Book or{" "}

            <span
              className="
                italic
                text-[#E75480]
              "
            >
              Enroll
            </span>
          </h1>

          <div
            className="
              mx-auto
              mt-5
              h-px
              w-16
              bg-[#E75480]/40
            "
          />

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-[13px]
              leading-6
              text-[#8A6F78]

              sm:text-sm
            "
          >
            Choose your service,
            preferred branch, date and
            available appointment time.
          </p>
        </div>

        {/* ====================================================
            FORM CARD
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            mx-auto
            max-w-3xl
            overflow-hidden
            rounded-[26px]
            border
            border-[#E75480]/10
            bg-white
            shadow-[0_20px_60px_rgba(58,42,47,0.07)]

            sm:rounded-[30px]
          "
        >
          <div
            className="
              space-y-9
              p-5

              sm:p-8

              md:p-10
            "
          >
            {/* ==================================================
                1. BOOKING TYPE
            ================================================== */}

            <div>
              <FormLabel>
                What would you like?
              </FormLabel>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-2
                  gap-3

                  sm:gap-4
                "
              >
                {/* SERVICE */}

                <TypeCard
                  selected={
                    type ===
                    "service"
                  }
                  title="Salon Service"
                  description="Book a beauty appointment"
                  icon="✦"
                  onClick={() => {
                    setType(
                      "service"
                    );

                    setSelectedItem(
                      ""
                    );

                    setBranch("");
                    setDate("");
                    setSelectedTime(
                      ""
                    );
                  }}
                />

                {/* COURSE */}

                <TypeCard
                  selected={
                    type ===
                    "course"
                  }
                  title="Academy Course"
                  description="Enroll in professional training"
                  icon="◇"
                  onClick={() => {
                    setType(
                      "course"
                    );

                    setSelectedItem(
                      ""
                    );

                    setBranch("");
                    setDate("");
                    setSelectedTime(
                      ""
                    );
                  }}
                />
              </div>
            </div>

            {/* ==================================================
                2. SERVICE / COURSE
            ================================================== */}

            <div>
              <FormLabel>
                {type === "service"
                  ? "Choose Service"
                  : "Choose Course"}
              </FormLabel>

              <select
                value={
                  selectedItem
                }
                onChange={(e) =>
                  setSelectedItem(
                    e.target.value
                  )
                }
                required
                className="
                  mt-3
                  w-full
                  rounded-xl
                  border
                  border-[#E75480]/15
                  bg-[#FFF9FB]
                  px-4
                  py-3.5
                  text-sm
                  text-[#3A2A2F]
                  outline-none
                  transition

                  focus:border-[#E75480]
                  focus:ring-2
                  focus:ring-[#E75480]/10
                "
              >
                <option value="">
                  {type ===
                  "service"
                    ? "Select Salon Service"
                    : "Select Academy Course"}
                </option>

                {(type ===
                "service"
                  ? services
                  : courses
                ).map(
                  (item) => (
                    <option
                      key={
                        item._id
                      }
                      value={
                        item._id
                      }
                    >
                      {
                        item.title
                      }

                      {"duration" in
                        item &&
                      item.duration
                        ? ` — ${item.duration} min`
                        : ""}
                    </option>
                  )
                )}
              </select>

              {type ===
                "service" &&
                selectedService
                  ?.duration && (
                  <p
                    className="
                      mt-2
                      text-[11px]
                      text-[#A98D96]
                    "
                  >
                    Estimated duration:{" "}
                    {
                      selectedService.duration
                    }{" "}
                    minutes
                  </p>
                )}
            </div>

            {/* ==================================================
                3. BRANCH
            ================================================== */}

            <div>
              <FormLabel>
                Choose Branch
              </FormLabel>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-3
                "
              >
                {branches.map(
                  (item) => {
                    const selected =
                      branch ===
                      item.name;

                    return (
                      <button
                        key={
                          item.name
                        }
                        type="button"
                        onClick={() =>
                          setBranch(
                            item.name
                          )
                        }
                        className={`
                          rounded-xl
                          border
                          px-4
                          py-4
                          text-center
                          text-[12px]
                          font-medium
                          transition-all
                          duration-200

                          ${
                            selected
                              ? `
                                border-[#E75480]
                                bg-[#FFF5F8]
                                text-[#E75480]
                                shadow-[0_6px_18px_rgba(231,84,128,0.10)]
                              `
                              : `
                                border-[#E75480]/15
                                bg-white
                                text-[#654E56]

                                hover:border-[#E75480]/50
                                hover:bg-[#FFF9FB]
                              `
                          }
                        `}
                      >
                        <span
                          className="
                            mb-1
                            block
                            text-[#E75480]
                          "
                        >
                          ⌖
                        </span>

                        {
                          item.name
                        }
                      </button>
                    );
                  }
                )}
              </div>

              {/* Hidden required field */}

              <input
                type="hidden"
                value={branch}
                required
              />
            </div>

            {/* ==================================================
                4. DATE
            ================================================== */}

            <div>
              <FormLabel>
                Appointment Date
              </FormLabel>

              <input
                type="date"
                value={date}
                min={getTodayString()}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                required
                className="
                  mt-3
                  w-full
                  rounded-xl
                  border
                  border-[#E75480]/15
                  bg-[#FFF9FB]
                  px-4
                  py-3.5
                  text-sm
                  text-[#3A2A2F]
                  outline-none
                  transition

                  focus:border-[#E75480]
                  focus:ring-2
                  focus:ring-[#E75480]/10
                "
              />
            </div>

            {/* ==================================================
                5. SERVICE AVAILABILITY
            ================================================== */}

            {type ===
              "service" && (
              <div>
                <div
                  className="
                    flex
                    flex-col
                    gap-2

                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                  "
                >
                  <div>
                    <FormLabel>
                      Available Time
                    </FormLabel>

                    {branch &&
                      date && (
                        <p
                          className="
                            mt-2
                            text-[11px]
                            text-[#A98D96]
                          "
                        >
                          {
                            branch
                          }{" "}
                          •{" "}
                          {formatDate(
                            date
                          )}
                        </p>
                      )}
                  </div>

                  {availability &&
                    !loadingAvailability && (
                      <p
                        className="
                          text-[10px]
                          font-medium
                          text-[#E75480]
                        "
                      >
                        {
                          availableSlotCount
                        }{" "}
                        available
                      </p>
                    )}
                </div>

                {/* BEFORE REQUIRED FIELDS */}

                {(!selectedItem ||
                  !branch ||
                  !date) && (
                  <div
                    className="
                      mt-3
                      rounded-xl
                      border
                      border-dashed
                      border-[#E75480]/20
                      bg-[#FFF9FB]
                      px-5
                      py-7
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xs
                        leading-5
                        text-[#A98D96]
                      "
                    >
                      Select a
                      service,
                      branch and
                      date to see
                      available
                      appointment
                      times.
                    </p>
                  </div>
                )}

                {/* LOADING */}

                {loadingAvailability && (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-center
                      gap-3
                      rounded-xl
                      bg-[#FFF9FB]
                      px-5
                      py-8
                    "
                  >
                    <div
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-[#E75480]/20
                        border-t-[#E75480]
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-[#8A6F78]
                      "
                    >
                      Checking
                      availability...
                    </span>
                  </div>
                )}

                {/* ERROR */}

                {availabilityError &&
                  !loadingAvailability && (
                    <div
                      className="
                        mt-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-xs
                        text-red-600
                      "
                    >
                      {
                        availabilityError
                      }
                    </div>
                  )}

                {/* SLOT GROUPS */}

                {!loadingAvailability &&
                  !availabilityError &&
                  slots.length >
                    0 && (
                    <div
                      className="
                        mt-4
                        space-y-6
                        rounded-2xl
                        border
                        border-[#E75480]/10
                        bg-[#FFF9FB]
                        p-4

                        sm:p-5
                      "
                    >
                      {renderSlotGroup(
                        "Morning",
                        morningSlots
                      )}

                      {renderSlotGroup(
                        "Afternoon",
                        afternoonSlots
                      )}

                      {renderSlotGroup(
                        "Evening",
                        eveningSlots
                      )}
                    </div>
                  )}

                {/* NO TIMES */}

                {!loadingAvailability &&
                  availability &&
                  availableSlotCount ===
                    0 && (
                    <div
                      className="
                        mt-3
                        rounded-xl
                        border
                        border-[#E75480]/10
                        bg-[#FFF9FB]
                        px-5
                        py-7
                        text-center
                      "
                    >
                      <p
                        className="
                          font-serif
                          text-lg
                          text-[#3A2A2F]
                        "
                      >
                        No appointments
                        available
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          text-[#8A6F78]
                        "
                      >
                        Please choose
                        another date or
                        branch.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* ==================================================
                COURSE TIME

                Keeping your existing behavior for courses.
            ================================================== */}

            {type ===
              "course" && (
              <div>
                <FormLabel>
                  Preferred Time
                </FormLabel>

                <input
                  type="time"
                  value={
                    selectedTime
                  }
                  onChange={(e) =>
                    setSelectedTime(
                      e.target.value
                    )
                  }
                  required
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-[#E75480]/15
                    bg-[#FFF9FB]
                    px-4
                    py-3.5
                    text-sm
                    outline-none

                    focus:border-[#E75480]
                    focus:ring-2
                    focus:ring-[#E75480]/10
                  "
                />
              </div>
            )}

            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div
              className="
                h-px
                bg-[#E75480]/10
              "
            />

            {/* ==================================================
                CUSTOMER DETAILS
            ================================================== */}

            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-6
                    bg-[#E75480]/50
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  Your Details
                </p>
              </div>

              <div
                className="
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >
                {/* NAME */}

                <div
                  className="
                    sm:col-span-2
                  "
                >
                  <FormLabel>
                    Full Name
                  </FormLabel>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Your full name"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-[#E75480]/15
                      bg-[#FFF9FB]
                      px-4
                      py-3.5
                      text-sm
                      outline-none

                      focus:border-[#E75480]
                      focus:ring-2
                      focus:ring-[#E75480]/10
                    "
                  />
                </div>

                {/* PHONE */}

                <div>
                  <FormLabel>
                    Phone Number
                  </FormLabel>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="98XXXXXXXX"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-[#E75480]/15
                      bg-[#FFF9FB]
                      px-4
                      py-3.5
                      text-sm
                      outline-none

                      focus:border-[#E75480]
                      focus:ring-2
                      focus:ring-[#E75480]/10
                    "
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <FormLabel>
                    Email Address
                  </FormLabel>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-[#E75480]/15
                      bg-[#FFF9FB]
                      px-4
                      py-3.5
                      text-sm
                      outline-none

                      focus:border-[#E75480]
                      focus:ring-2
                      focus:ring-[#E75480]/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                SELECTED APPOINTMENT SUMMARY
            ================================================== */}

            {type ===
              "service" &&
              selectedService &&
              branch &&
              date &&
              selectedTime && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-[#E75480]/15
                    bg-[#FFF5F8]
                    p-5
                  "
                >
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[3px]
                      text-[#E75480]
                    "
                  >
                    Your Appointment
                  </p>

                  <div
                    className="
                      mt-4
                      grid
                      gap-3
                      text-[12px]
                      text-[#654E56]

                      sm:grid-cols-2
                    "
                  >
                    <p>
                      <strong>
                        Service:
                      </strong>{" "}
                      {
                        selectedService.title
                      }
                    </p>

                    <p>
                      <strong>
                        Branch:
                      </strong>{" "}
                      {branch}
                    </p>

                    <p>
                      <strong>
                        Date:
                      </strong>{" "}
                      {formatDate(
                        date
                      )}
                    </p>

                    <p>
                      <strong>
                        Time:
                      </strong>{" "}
                      {formatTime(
                        selectedTime
                      )}
                    </p>
                  </div>
                </div>
              )}

            {/* ==================================================
                ERRORS
            ================================================== */}

            {submitError && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-red-600
                "
              >
                {submitError}
              </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
              <div
                className="
                  rounded-xl
                  border
                  border-[#E75480]/20
                  bg-[#FFF5F8]
                  px-4
                  py-4
                  text-sm
                  leading-6
                  text-[#654E56]
                "
              >
                <span
                  className="
                    font-semibold
                    text-[#E75480]
                  "
                >
                  ✓
                </span>{" "}
                {successMessage}
              </div>
            )}

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={
                loading ||
                (type ===
                  "service" &&
                  !selectedTime)
              }
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-4
                rounded-full
                bg-[#E75480]
                px-8
                py-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[2.5px]
                text-white
                shadow-[0_12px_30px_rgba(231,84,128,0.22)]
                transition-all
                duration-300

                hover:-translate-y-[2px]
                hover:bg-[#D94773]
                hover:shadow-[0_16px_35px_rgba(231,84,128,0.30)]

                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              {loading
                ? "Submitting..."
                : type ===
                  "service"
                ? "Confirm Appointment"
                : "Confirm Enrollment"}

              {!loading && (
                <span
                  className="
                    text-base
                    transition-transform
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

/* ============================================================
   SMALL REUSABLE COMPONENTS
============================================================ */

function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      className="
        text-[9px]
        font-semibold
        uppercase
        tracking-[2.5px]
        text-[#654E56]
      "
    >
      {children}
    </p>
  );
}

type TypeCardProps = {
  selected: boolean;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
};

function TypeCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: TypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        rounded-2xl
        border
        p-4
        text-left
        transition-all
        duration-300

        sm:p-5

        ${
          selected
            ? `
              border-[#E75480]
              bg-[#FFF5F8]
              shadow-[0_8px_25px_rgba(231,84,128,0.10)]
            `
            : `
              border-[#E75480]/15
              bg-white

              hover:border-[#E75480]/40
              hover:bg-[#FFF9FB]
            `
        }
      `}
    >
      {/* CHECK */}

      <span
        className={`
          absolute
          right-3
          top-3
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          border
          text-[9px]

          ${
            selected
              ? `
                border-[#E75480]
                bg-[#E75480]
                text-white
              `
              : `
                border-[#E75480]/25
                bg-white
                text-transparent
              `
          }
        `}
      >
        ✓
      </span>

      {/* ICON */}

      <div
        className={`
          mb-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-base

          sm:h-10
          sm:w-10

          ${
            selected
              ? `
                bg-[#E75480]
                text-white
              `
              : `
                bg-[#FFF5F8]
                text-[#E75480]
              `
          }
        `}
      >
        {icon}
      </div>

      <h3
        className="
          pr-5
          font-serif
          text-[17px]
          leading-tight
          text-[#3A2A2F]

          sm:text-xl
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-1
          text-[10px]
          leading-4
          text-[#8A6F78]

          sm:text-[11px]
          sm:leading-5
        "
      >
        {description}
      </p>
    </button>
  );
}