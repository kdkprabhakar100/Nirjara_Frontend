import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

/* =========================================================
   TYPES
========================================================= */

type SocialLinks = {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
};

type FooterSettings = {
  showSocialLinks: boolean;
  showBookAppointment: boolean;
  showBranches?: boolean;

  copyrightText: string;

  developerName: string;
  developerUrl: string;

  privacyPolicyUrl?: string;
  termsUrl?: string;
};

type SiteSettings = {
  salonName: string;

  description: string;

  email: string;

  phone: string;

  whatsapp: string;

  socialLinks:
    SocialLinks;

  footer:
    FooterSettings;
};

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings:
  SiteSettings = {
  salonName:
    "Nirjara Beauty",

  description:
    "A professional beauty salon and academy offering salon services, beauty training, and customer-focused care in Kathmandu.",

  email:
    "",

  phone:
    "",

  whatsapp:
    "",

  socialLinks: {
    facebook:
      "",

    instagram:
      "",

    tiktok:
      "",

    youtube:
      "",
  },

  footer: {
    showSocialLinks:
      true,

    showBookAppointment:
      true,

    showBranches:
      true,

    copyrightText:
      "© 2026 Nirjara Beauty. All rights reserved.",

    developerName:
      "Prabhakar Khadka",

    developerUrl:
      "",

    privacyPolicyUrl:
      "/privacy-policy",

    termsUrl:
      "/terms",
  },
};

/* =========================================================
   LINKS
========================================================= */

const explorePages = [
  {
    label:
      "Gallery",

    path:
      "/gallery",
  },

  {
    label:
      "Blog",

    path:
      "/blog",
  },

  {
    label:
      "Events",

    path:
      "/events",
  },

  {
    label:
      "Social Media",

    path:
      "/social-media",
  },
];

const visitPages = [
  {
    label:
      "Branches",

    path:
      "/branches",
  },

  {
    label:
      "Contact",

    path:
      "/contact",
  },

  {
    label:
      "Book Appointment",

    path:
      "/booking",
  },
];

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const location =
    useLocation();

  const [
    settings,
    setSettings,
  ] =
    useState<SiteSettings>(
      defaultSettings
    );

  const API_URL =
    import.meta.env
      .VITE_API_URL ||
    "http://localhost:5000";

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  useEffect(
    () => {
      const loadSettings =
        async () => {
          try {
            const response =
              await fetch(
                `${API_URL}/api/site-settings`
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Could not load site settings."
              );
            }

            const data =
              await response.json();

            setSettings({
              ...defaultSettings,

              ...data,

              socialLinks: {
                ...defaultSettings.socialLinks,

                ...(data.socialLinks ??
                  {}),
              },

              footer: {
                ...defaultSettings.footer,

                ...(data.footer ??
                  {}),
              },
            });
          } catch (
            error
          ) {
            console.error(
              "Footer settings error:",
              error
            );
          }
        };

      loadSettings();
    },

    [
      API_URL,
    ]
  );

  /* =======================================================
     SCROLL TO TOP
  ======================================================= */

  useEffect(
    () => {
      window.scrollTo({
        top:
          0,

        left:
          0,

        behavior:
          "auto",
      });
    },

    [
      location.pathname,
    ]
  );

  /* =======================================================
     VALUES
  ======================================================= */

  const footer =
    settings.footer;

  const whatsappNumber =
    settings.whatsapp.replace(
      /\D/g,
      ""
    );

  const hasSocialLinks =
    Object.values(
      settings.socialLinks
    ).some(
      Boolean
    );

  const currentYear =
    new Date().getFullYear();

  const copyrightText =
    footer.copyrightText ||
    `© ${currentYear} ${settings.salonName}. All rights reserved.`;

  const privacyPolicyUrl =
    footer.privacyPolicyUrl ||
    "/privacy-policy";

  const termsUrl =
    footer.termsUrl ||
    "/terms";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <footer
      className="
        border-t
        border-[#E75480]/10

        bg-[#FFF9FB]

        text-[#3A2A2F]
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl

          px-5
          py-7

          sm:px-6
          sm:py-8

          md:px-8
          md:py-9

          lg:px-10
          lg:py-10
        "
      >
        {/* =================================================
            BOOKING CTA
        ================================================= */}

        {footer.showBookAppointment && (
          <div
            className="
              rounded-[22px]

              border
              border-[#E75480]/10

              bg-white

              px-5
              py-5

              shadow-[0_10px_35px_rgba(231,84,128,0.06)]

              sm:px-6
              sm:py-6

              lg:px-8
              lg:py-6
            "
          >
            <div
              className="
                flex
                flex-col

                items-start

                gap-4

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div className="max-w-2xl">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[4px]

                    text-[#E75480]
                  "
                >
                  {
                    settings.salonName
                  }
                </p>

                <h2
                  className="
                    mt-2

                    font-serif

                    text-[23px]
                    leading-[1.15]

                    text-[#3A2A2F]

                    sm:text-[27px]

                    md:text-[29px]

                    lg:text-[32px]
                  "
                >
                  Ready for your
                  next{" "}

                  <span
                    className="
                      italic
                      text-[#E75480]
                    "
                  >
                    beauty moment?
                  </span>
                </h2>
              </div>

              <Link
                to="/booking"
                className="
                  inline-flex

                  w-full

                  items-center
                  justify-center

                  gap-2

                  rounded-full

                  bg-[#E75480]

                  px-6
                  py-3

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[2px]

                  text-white

                  shadow-[0_7px_20px_rgba(231,84,128,0.18)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#D94873]

                  sm:w-auto
                "
              >
                Book Appointment

                <ArrowUpRight
                  size={14}
                />
              </Link>
            </div>
          </div>
        )}

        {/* =================================================
            MAIN FOOTER

            MOBILE:
            Brand = full width
            Explore + Visit = side by side
            Contact = full width

            TABLET:
            Same arrangement

            DESKTOP:
            Brand | Explore | Visit | Contact
        ================================================= */}

        <div
          className={`
            grid

            grid-cols-2

            gap-x-6
            gap-y-8

            ${
              footer.showBookAppointment
                ? "mt-8"
                : ""
            }

            sm:gap-x-10

            md:gap-x-12
            md:gap-y-9

            lg:grid-cols-[1.35fr_0.65fr_0.7fr_1fr]
            lg:gap-x-10
            lg:gap-y-0

            xl:gap-x-14
          `}
        >
          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              col-span-2

              lg:col-span-1
            "
          >
            <Link
              to="/"
              className="
                inline-block

                font-serif

                text-[29px]

                text-[#E75480]

                sm:text-[32px]

                lg:text-[34px]
              "
            >
              {
                settings.salonName
              }
            </Link>

            <div
              className="
                mt-3

                h-[2px]
                w-9

                rounded-full

                bg-[#E75480]
              "
            />

            <p
              className="
                mt-3

                max-w-xl

                text-[13px]
                leading-6

                text-[#8A6F78]

                sm:text-sm
                sm:leading-7

                lg:max-w-md
              "
            >
              {
                settings.description
              }
            </p>

            {/* ===============================================
                SOCIAL MEDIA
            =============================================== */}

            {footer.showSocialLinks &&
              hasSocialLinks && (
                <div
                  className="
                    mt-4
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
                    Follow Our Journey
                  </p>

                  <div
                    className="
                      mt-3

                      flex
                      flex-wrap

                      gap-2.5
                    "
                  >
                    {settings
                      .socialLinks
                      .facebook && (
                      <SocialButton
                        href={
                          settings
                            .socialLinks
                            .facebook
                        }
                        label="Facebook"
                      >
                        <FaFacebookF
                          size={15}
                        />
                      </SocialButton>
                    )}

                    {settings
                      .socialLinks
                      .instagram && (
                      <SocialButton
                        href={
                          settings
                            .socialLinks
                            .instagram
                        }
                        label="Instagram"
                      >
                        <FaInstagram
                          size={16}
                        />
                      </SocialButton>
                    )}

                    {settings
                      .socialLinks
                      .tiktok && (
                      <SocialButton
                        href={
                          settings
                            .socialLinks
                            .tiktok
                        }
                        label="TikTok"
                      >
                        <FaTiktok
                          size={15}
                        />
                      </SocialButton>
                    )}

                    {settings
                      .socialLinks
                      .youtube && (
                      <SocialButton
                        href={
                          settings
                            .socialLinks
                            .youtube
                        }
                        label="YouTube"
                      >
                        <FaYoutube
                          size={17}
                        />
                      </SocialButton>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* =================================================
              EXPLORE

              Mobile: left column
          ================================================= */}

          <div
            className="
              col-span-1
            "
          >
            <FooterHeading>
              Explore
            </FooterHeading>

            <div
              className="
                mt-4
                space-y-2.5

                sm:mt-5
                sm:space-y-3
              "
            >
              {explorePages.map(
                (
                  page
                ) => (
                  <FooterLink
                    key={
                      page.path
                    }
                    path={
                      page.path
                    }
                    label={
                      page.label
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =================================================
              VISIT

              Mobile: right column
          ================================================= */}

          <div
            className="
              col-span-1
            "
          >
            <FooterHeading>
              Visit
            </FooterHeading>

            <div
              className="
                mt-4
                space-y-2.5

                sm:mt-5
                sm:space-y-3
              "
            >
              {visitPages.map(
                (
                  page
                ) => (
                  <FooterLink
                    key={
                      page.path
                    }
                    path={
                      page.path
                    }
                    label={
                      page.label
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =================================================
              GET IN TOUCH

              Mobile/tablet: full width
              Desktop: one column
          ================================================= */}

          <div
            className="
              col-span-2

              lg:col-span-1
            "
          >
            <FooterHeading>
              Get In Touch
            </FooterHeading>

            <div
              className="
                mt-4

                grid

                gap-2.5

                sm:mt-5
                sm:grid-cols-2
                sm:gap-3

                lg:grid-cols-1
              "
            >
              {/* PHONE */}

              {settings.phone && (
                <ContactCard
                  icon={
                    <Phone
                      size={14}
                    />
                  }
                  label="Call Us"
                  value={
                    settings.phone
                  }
                  href={`tel:${settings.phone}`}
                />
              )}

              {/* EMAIL */}

              {settings.email && (
                <ContactCard
                  icon={
                    <Mail
                      size={14}
                    />
                  }
                  label="Email"
                  value={
                    settings.email
                  }
                  href={`mailto:${settings.email}`}
                />
              )}

              {/* WHATSAPP */}

              {settings.whatsapp &&
                whatsappNumber && (
                  <ContactCard
                    icon={
                      <MessageCircle
                        size={14}
                      />
                    }
                    label="WhatsApp"
                    value={
                      settings.whatsapp
                    }
                    href={`https://wa.me/${whatsappNumber}`}
                    external
                  />
                )}

              {/* BRANCH */}

              {footer.showBranches !==
                false && (
                <Link
                  to="/branches"
                  className="
                    group

                    flex
                    min-w-0

                    items-center

                    gap-3

                    rounded-[16px]

                    border
                    border-[#E75480]/10

                    bg-white/70

                    px-4
                    py-3

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-[#E75480]/30
                    hover:bg-white
                    hover:shadow-sm
                  "
                >
                  <div
                    className="
                      flex

                      h-8
                      w-8

                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      bg-[#FCE7EF]

                      text-[#E75480]

                      transition-colors
                      duration-300

                      group-hover:bg-[#E75480]
                      group-hover:text-white
                    "
                  >
                    <MapPin
                      size={14}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[2px]

                        text-[#E75480]
                      "
                    >
                      Our Locations
                    </p>

                    <p
                      className="
                        mt-0.5

                        truncate

                        text-sm

                        text-[#8A6F78]
                      "
                    >
                      Find a Nirjara branch
                    </p>
                  </div>

                  <ArrowUpRight
                    size={13}
                    className="
                      shrink-0

                      text-[#C77A95]

                      transition-transform

                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================= */}

        <div
          className="
            mt-8

            border-t
            border-[#E75480]/10

            pt-5
          "
        >
          <div
            className="
              flex
              flex-col

              items-center

              gap-3

              text-center

              text-[10px]
              leading-5

              text-[#9B7C85]

              lg:flex-row
              lg:justify-between
              lg:gap-6
              lg:text-left
            "
          >
            {/* COPYRIGHT */}

            <p>
              {
                copyrightText
              }
            </p>

            {/* DEVELOPER */}

            {footer.developerName && (
              <p>
                Designed & Developed by{" "}

                {footer.developerUrl ? (
                  <a
                    href={
                      footer.developerUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      font-medium

                      text-[#E75480]

                      transition

                      hover:text-[#D94873]
                    "
                  >
                    {
                      footer.developerName
                    }
                  </a>
                ) : (
                  <span
                    className="
                      font-medium
                      text-[#E75480]
                    "
                  >
                    {
                      footer.developerName
                    }
                  </span>
                )}
              </p>
            )}

            {/* LEGAL */}

            <div
              className="
                flex
                flex-wrap

                items-center
                justify-center

                gap-x-5
                gap-y-2

                lg:justify-end
              "
            >
              <Link
                to={
                  privacyPolicyUrl
                }
                className="
                  transition

                  hover:text-[#E75480]
                "
              >
                Privacy Policy
              </Link>

              <Link
                to={
                  termsUrl
                }
                className="
                  transition

                  hover:text-[#E75480]
                "
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  return (
    <Link
      to={
        path
      }
      className="
        group

        flex
        w-fit

        items-center
        gap-1.5

        text-[13px]

        text-[#8A6F78]

        transition-all
        duration-200

        hover:translate-x-1
        hover:text-[#E75480]

        sm:text-sm
      "
    >
      {
        label
      }

      <span
        className="
          opacity-0

          transition-opacity

          group-hover:opacity-100
        "
      >
        →
      </span>
    </Link>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[3px]

          text-[#E75480]

          sm:text-[9px]
          sm:tracking-[4px]
        "
      >
        {
          children
        }
      </h3>

      <div
        className="
          mt-2.5

          h-px
          w-7

          bg-[#E75480]

          sm:mt-3
        "
      />
    </div>
  );
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;

  children:
    React.ReactNode;
}) {
  return (
    <a
      href={
        href
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        label
      }
      title={
        label
      }
      className="
        group

        flex

        h-9
        w-9

        items-center
        justify-center

        rounded-full

        border
        border-[#E75480]/15

        bg-white

        text-[#E75480]

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[#E75480]
        hover:bg-[#E75480]
        hover:text-white
        hover:shadow-[0_8px_20px_rgba(231,84,128,0.18)]

        focus:outline-none
        focus:ring-2
        focus:ring-[#E75480]/25
      "
    >
      <span
        className="
          flex

          items-center
          justify-center

          transition-transform
          duration-300

          group-hover:scale-110
        "
      >
        {
          children
        }
      </span>
    </a>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon:
    React.ReactNode;

  label: string;

  value: string;

  href: string;

  external?: boolean;
}) {
  return (
    <a
      href={
        href
      }
      target={
        external
          ? "_blank"
          : undefined
      }
      rel={
        external
          ? "noopener noreferrer"
          : undefined
      }
      className="
        group

        flex
        min-w-0

        items-center

        gap-3

        rounded-[16px]

        border
        border-[#E75480]/10

        bg-white/70

        px-4
        py-3

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-[#E75480]/30
        hover:bg-white
        hover:shadow-sm
      "
    >
      <div
        className="
          flex

          h-8
          w-8

          shrink-0

          items-center
          justify-center

          rounded-full

          bg-[#FCE7EF]

          text-[#E75480]

          transition-colors
          duration-300

          group-hover:bg-[#E75480]
          group-hover:text-white
        "
      >
        {
          icon
        }
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[7px]
            font-semibold
            uppercase
            tracking-[2px]

            text-[#E75480]
          "
        >
          {
            label
          }
        </p>

        <p
          className="
            mt-0.5

            truncate

            text-sm

            text-[#8A6F78]
          "
        >
          {
            value
          }
        </p>
      </div>
    </a>
  );
}