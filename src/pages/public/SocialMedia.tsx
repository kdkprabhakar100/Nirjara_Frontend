import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import {
  FaThreads,
  FaXTwitter,
} from "react-icons/fa6";

import SEO from "../../components/SEO";

/* =========================================================
   TYPES
========================================================= */

type SocialMediaAccount = {
  _id: string;

  platform: string;

  platformKey: string;

  accountName: string;

  username: string;

  url: string;

  image: string;

  description: string;

  active: boolean;

  featured: boolean;

  sortOrder: number;
};

type PlatformGroup = {
  platform: string;

  platformKey: string;

  accounts: SocialMediaAccount[];
};

/* =========================================================
   SEO
========================================================= */

const SOCIAL_SEO = {
  title:
    "Social Media | Follow Nirjara Beauty",

  description:
    "Follow Nirjara Beauty across TikTok, Instagram, Facebook, YouTube, WhatsApp and other social platforms.",

  keywords:
    "Nirjara Beauty social media, Nirjara Beauty Instagram, Nirjara Beauty TikTok, Nirjara Beauty Facebook, Nirjara Beauty YouTube",

  canonical:
    "/social-media",

  image:
    "/images/nirjara-og.jpg",
};

/* =========================================================
   PLATFORM ICON
========================================================= */

function PlatformIcon({
  platformKey,
  size = 18,
}: {
  platformKey: string;

  size?: number;
}) {
  const key =
    platformKey
      .trim()
      .toLowerCase();

  if (
    key.includes(
      "facebook"
    )
  ) {
    return (
      <FaFacebookF
        size={size}
      />
    );
  }

  if (
    key.includes(
      "instagram"
    )
  ) {
    return (
      <FaInstagram
        size={size}
      />
    );
  }

  if (
    key.includes(
      "tiktok"
    )
  ) {
    return (
      <FaTiktok
        size={size}
      />
    );
  }

  if (
    key.includes(
      "youtube"
    )
  ) {
    return (
      <FaYoutube
        size={size}
      />
    );
  }

  if (
    key.includes(
      "whatsapp"
    )
  ) {
    return (
      <FaWhatsapp
        size={size}
      />
    );
  }

  if (
    key.includes(
      "pinterest"
    )
  ) {
    return (
      <FaPinterestP
        size={size}
      />
    );
  }

  if (
    key.includes(
      "linkedin"
    )
  ) {
    return (
      <FaLinkedinIn
        size={size}
      />
    );
  }

  if (
    key.includes(
      "threads"
    )
  ) {
    return (
      <FaThreads
        size={size}
      />
    );
  }

  if (
    key === "x" ||
    key.includes(
      "twitter"
    )
  ) {
    return (
      <FaXTwitter
        size={size}
      />
    );
  }

  if (
    key.includes(
      "snapchat"
    )
  ) {
    return (
      <FaSnapchatGhost
        size={size}
      />
    );
  }

  return (
    <ExternalLink
      size={size}
    />
  );
}

/* =========================================================
   CTA LABEL
========================================================= */

function getPlatformAction(
  platformKey: string
) {
  const key =
    platformKey
      .trim()
      .toLowerCase();

  if (
    key.includes(
      "youtube"
    )
  ) {
    return "Watch on YouTube";
  }

  if (
    key.includes(
      "whatsapp"
    )
  ) {
    return "Chat on WhatsApp";
  }

  if (
    key.includes(
      "instagram"
    )
  ) {
    return "Follow on Instagram";
  }

  if (
    key.includes(
      "tiktok"
    )
  ) {
    return "Follow on TikTok";
  }

  if (
    key.includes(
      "facebook"
    )
  ) {
    return "Visit Facebook";
  }

  if (
    key.includes(
      "pinterest"
    )
  ) {
    return "View on Pinterest";
  }

  if (
    key.includes(
      "linkedin"
    )
  ) {
    return "View on LinkedIn";
  }

  if (
    key.includes(
      "threads"
    )
  ) {
    return "Follow on Threads";
  }

  if (
    key === "x" ||
    key.includes(
      "twitter"
    )
  ) {
    return "Follow on X";
  }

  if (
    key.includes(
      "snapchat"
    )
  ) {
    return "Follow on Snapchat";
  }

  return "Visit Profile";
}

/* =========================================================
   PAGE
========================================================= */

export default function SocialMedia() {
  const [
    accounts,
    setAccounts,
  ] =
    useState<
      SocialMediaAccount[]
    >(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    selectedPlatform,
    setSelectedPlatform,
  ] =
    useState(
      "all"
    );

  const API_URL =
    import.meta.env
      .VITE_API_URL ||
    "http://localhost:5000";

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    const fetchSocialMedia =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const response =
            await fetch(
              `${API_URL}/api/social-media`
            );

          if (
            !response.ok
          ) {
            throw new Error(
              "Unable to load social media accounts."
            );
          }

          const data =
            await response.json();

          setAccounts(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          error
        ) {
          console.error(
            "Social media fetch error:",
            error
          );

          setError(
            "We could not load our social accounts right now."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchSocialMedia();
  }, [API_URL]);

  /* =======================================================
     GROUP BY PLATFORM
  ======================================================= */

  const platformGroups =
    useMemo<
      PlatformGroup[]
    >(() => {
      const grouped =
        new Map<
          string,
          PlatformGroup
        >();

      accounts.forEach(
        (
          account
        ) => {
          const key =
            account.platformKey ||
            account.platform
              .trim()
              .toLowerCase();

          const existing =
            grouped.get(
              key
            );

          if (
            existing
          ) {
            existing.accounts.push(
              account
            );

            return;
          }

          grouped.set(
            key,
            {
              platform:
                account.platform,

              platformKey:
                key,

              accounts: [
                account,
              ],
            }
          );
        }
      );

      return Array.from(
        grouped.values()
      )
        .map(
          (
            group
          ) => ({
            ...group,

            accounts:
              [...group.accounts].sort(
                (
                  a,
                  b
                ) =>
                  a.sortOrder -
                  b.sortOrder
              ),
          })
        )
        .sort(
          (
            a,
            b
          ) => {
            const firstA =
              a.accounts[0]
                ?.sortOrder ??
              0;

            const firstB =
              b.accounts[0]
                ?.sortOrder ??
              0;

            return (
              firstA -
              firstB
            );
          }
        );
    }, [accounts]);

  /* =======================================================
     FILTER
  ======================================================= */

  const visibleGroups =
    useMemo(
      () => {
        if (
          selectedPlatform ===
          "all"
        ) {
          return platformGroups;
        }

        return platformGroups.filter(
          (
            group
          ) =>
            group.platformKey ===
            selectedPlatform
        );
      },

      [
        platformGroups,
        selectedPlatform,
      ]
    );

  const totalAccounts =
    accounts.length;

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {
    return (
      <>
        <SEO
          title={
            SOCIAL_SEO.title
          }
          description={
            SOCIAL_SEO.description
          }
          keywords={
            SOCIAL_SEO.keywords
          }
          canonical={
            SOCIAL_SEO.canonical
          }
          image={
            SOCIAL_SEO.image
          }
          type="website"
        />

        <main
          className="
            min-h-screen
            bg-[#FFF5F8]
            pt-16
          "
        >
          <div
            className="
              flex
              min-h-[420px]
              items-center
              justify-center
            "
          >
            <div
              className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-[#E75480]/20
                border-t-[#E75480]
              "
            />
          </div>
        </main>
      </>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <SEO
        title={
          SOCIAL_SEO.title
        }
        description={
          SOCIAL_SEO.description
        }
        keywords={
          SOCIAL_SEO.keywords
        }
        canonical={
          SOCIAL_SEO.canonical
        }
        image={
          SOCIAL_SEO.image
        }
        type="website"
      />

      <main
        className="
          min-h-screen
          overflow-hidden
          bg-[#FFF5F8]
          pt-16
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            mx-auto
            max-w-5xl
            px-4
            pb-4
            pt-4
            text-center

            sm:pt-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                hidden
                h-px
                w-8
                bg-[#E75480]/30
                sm:block
              "
            />

            <p
              className="
                text-[7px]
                font-semibold
                uppercase
                tracking-[3.5px]
                text-[#E75480]

                sm:text-[8px]
              "
            >
              Connect With Us
            </p>

            <span
              className="
                hidden
                h-px
                w-8
                bg-[#E75480]/30
                sm:block
              "
            />
          </div>

          <h1
            className="
              mt-2
              font-serif
              text-[30px]
              leading-[1]
              text-[#3A2A2F]

              sm:text-[36px]
              md:text-[40px]
              lg:text-[44px]
            "
          >
            Follow Nirjara{" "}

            <span
              className="
                italic
                text-[#E75480]
              "
            >
              Everywhere
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-2.5
              max-w-xl
              text-[11px]
              leading-5
              text-[#8A6F78]

              sm:text-[12px]
            "
          >
            Beauty, academy,
            transformations and
            everyday Nirjara moments
            — all in one place.
          </p>

          {!error &&
            totalAccounts >
              0 && (
              <p
                className="
                  mt-2.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[1.7px]
                  text-[#B89BA5]
                "
              >
                {
                  totalAccounts
                }{" "}
                profile
                {totalAccounts ===
                1
                  ? ""
                  : "s"}{" "}
                •{" "}
                {
                  platformGroups.length
                }{" "}
                platform
                {platformGroups.length ===
                1
                  ? ""
                  : "s"}
              </p>
            )}
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (
          <section
            className="
              mx-auto
              max-w-2xl
              px-4
              pb-10
              pt-3
            "
          >
            <div
              className="
                rounded-[20px]
                border
                border-[#E75480]/10
                bg-white
                px-5
                py-8
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  text-[#3A2A2F]
                "
              >
                Social profiles
                unavailable
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-[#8A6F78]
                "
              >
                {error}
              </p>
            </div>
          </section>
        ) : accounts.length ===
          0 ? (
          /* =================================================
             EMPTY
          ================================================= */

          <section
            className="
              mx-auto
              max-w-2xl
              px-4
              pb-10
              pt-3
            "
          >
            <div
              className="
                rounded-[20px]
                border
                border-[#E75480]/10
                bg-white
                px-5
                py-8
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  text-[#3A2A2F]
                "
              >
                Follow us soon
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-[#8A6F78]
                "
              >
                Our social accounts
                will appear here.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* =================================================
                FILTER
            ================================================= */}

            <section
              className="
                mx-auto
                max-w-5xl
                px-4
                pb-5
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-1.5
                "
              >
                <PlatformFilterButton
                  active={
                    selectedPlatform ===
                    "all"
                  }
                  label="All"
                  onClick={() =>
                    setSelectedPlatform(
                      "all"
                    )
                  }
                />

                {platformGroups.map(
                  (
                    group
                  ) => (
                    <PlatformFilterButton
                      key={
                        group.platformKey
                      }
                      active={
                        selectedPlatform ===
                        group.platformKey
                      }
                      label={
                        group.platform
                      }
                      platformKey={
                        group.platformKey
                      }
                      onClick={() =>
                        setSelectedPlatform(
                          group.platformKey
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* =================================================
                GROUPS
            ================================================= */}

            <section
              className="
                mx-auto
                max-w-5xl
                px-4
                pb-10
              "
            >
              {visibleGroups.map(
                (
                  group,
                  groupIndex
                ) => {
                  const isSingle =
                    group.accounts
                      .length ===
                    1;

                  return (
                    <div
                      key={
                        group.platformKey
                      }
                      className={
                        groupIndex ===
                        0
                          ? ""
                          : "mt-7 md:mt-8"
                      }
                    >
                      {/* =======================================
                          CENTERED PLATFORM HEADING
                      ======================================= */}

                      <div
                        className="
                          relative
                          flex
                          flex-col
                          items-center
                          justify-center
                          border-b
                          border-[#E75480]/10
                          pb-3
                          text-center
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2.5
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
                              border
                              border-[#E75480]/15
                              bg-white
                              text-[#E75480]
                            "
                          >
                            <PlatformIcon
                              platformKey={
                                group.platformKey
                              }
                              size={
                                14
                              }
                            />
                          </div>

                          <h2
                            className="
                              font-serif
                              text-[20px]
                              leading-none
                              text-[#3A2A2F]

                              sm:text-[22px]
                            "
                          >
                            {
                              group.platform
                            }
                          </h2>
                        </div>

                        <p
                          className="
                            mt-1.5
                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-[1.4px]
                            text-[#B89BA5]
                          "
                        >
                          {
                            group.accounts
                              .length
                          }{" "}
                          profile
                          {group.accounts
                            .length ===
                          1
                            ? ""
                            : "s"}
                        </p>
                      </div>

                      {/* =======================================
                          ACCOUNT GRID
                      ======================================= */}
                        <div
                        className={`
                            mt-3

                            ${
                            isSingle
                                ? `
                                    flex
                                    justify-center
                                `
                                : `
                                    grid
                                    gap-3

                                    md:grid-cols-2
                                `
                            }
                        `}
                        >
                        {group.accounts.map(
                            (account) => (
                            <AccountCard
                                key={account._id}
                                account={account}
                                single={isSingle}
                            />
                            )
                        )}
                        </div>
                    </div>
                  );
                }
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function PlatformFilterButton({
  active,
  label,
  platformKey,
  onClick,
}: {
  active: boolean;

  label: string;

  platformKey?: string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-[9px]
        font-medium
        transition-all
        duration-200

        ${
          active
            ? `
                border-[#E75480]
                bg-[#E75480]
                text-white
              `
            : `
                border-[#E75480]/15
                bg-white
                text-[#8A6F78]

                hover:border-[#E75480]/40
                hover:text-[#E75480]
              `
        }
      `}
    >
      {platformKey && (
        <PlatformIcon
          platformKey={
            platformKey
          }
          size={
            10
          }
        />
      )}

      {label}
    </button>
  );
}

/* =========================================================
   ACCOUNT CARD
========================================================= */

function AccountCard({
  account,
  single = false,
}: {
  account: SocialMediaAccount;
  single?: boolean;
}) {
  const actionLabel =
    getPlatformAction(
      account.platformKey
    );

  return (
    <a
      href={account.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group

        flex
        items-center

        gap-4

        rounded-[18px]

        border
        border-[#E75480]/10

        bg-white

        px-4
        py-4

        shadow-[0_4px_16px_rgba(58,42,47,0.04)]

        transition-all
        duration-300

        hover:-translate-y-[2px]

        hover:border-[#E75480]/25

        hover:shadow-[0_12px_30px_rgba(58,42,47,0.08)]

        ${
          single
            ? `
                w-full
                max-w-[460px]
              `
            : `
                w-full
              `
        }
      `}
    >
      {/* =====================================================
          PROFILE IMAGE / PLATFORM ICON
      ===================================================== */}

      <div className="shrink-0">
        {account.image ? (
          <img
            src={account.image}
            alt={account.accountName}
            loading="lazy"
            className="
              h-[58px]
              w-[58px]

              rounded-[16px]

              border
              border-[#E75480]/10

              object-cover

              sm:h-16
              sm:w-16
            "
          />
        ) : (
          <div
            className="
              flex

              h-[58px]
              w-[58px]

              items-center
              justify-center

              rounded-[16px]

              border
              border-[#E75480]/10

              bg-[#FFF5F8]

              text-[#E75480]

              sm:h-16
              sm:w-16
            "
          >
            <PlatformIcon
              platformKey={account.platformKey}
              size={20}
            />
          </div>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              inline-flex

              items-center
              gap-1.5

              rounded-full

              bg-[#FFF5F8]

              px-2
              py-1

              text-[7px]
              font-semibold
              uppercase
              tracking-[1.4px]

              text-[#E75480]
            "
          >
            <PlatformIcon
              platformKey={account.platformKey}
              size={9}
            />

            {account.platform}
          </span>

          {account.featured && (
            <span
              className="
                rounded-full

                bg-[#FCE7EF]

                px-2
                py-1

                text-[7px]
                font-semibold
                uppercase
                tracking-[1px]

                text-[#E75480]
              "
            >
              Featured
            </span>
          )}
        </div>

        <h3
          className="
            mt-2

            truncate

            font-serif

            text-[18px]
            leading-tight

            text-[#3A2A2F]

            sm:text-[20px]
          "
        >
          {account.accountName}
        </h3>

        {account.username && (
          <p
            className="
              mt-0.5

              truncate

              text-[10px]

              text-[#A98994]

              sm:text-[11px]
            "
          >
            {account.username}
          </p>
        )}

        {account.description && (
          <p
            className="
              mt-1.5

              line-clamp-1

              text-[10px]
              leading-5

              text-[#8A6F78]
            "
          >
            {account.description}
          </p>
        )}
      </div>

      {/* =====================================================
          ACTION
      ===================================================== */}

      <div
        className="
          flex
          shrink-0
          flex-col
          items-end
          justify-center

          gap-2
        "
      >
        <div
          className="
            flex

            h-8
            w-8

            items-center
            justify-center

            rounded-full

            border
            border-[#E75480]/15

            text-[#E75480]

            transition-all
            duration-200

            group-hover:border-[#E75480]

            group-hover:bg-[#E75480]

            group-hover:text-white
          "
        >
          <ArrowUpRight
            size={13}
          />
        </div>

        <span
          className="
            hidden

            whitespace-nowrap

            text-[7px]
            font-semibold
            uppercase
            tracking-[1px]

            text-[#E75480]

            sm:block
          "
        >
          {actionLabel}
        </span>
      </div>
    </a>
  );
}