import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  ChevronRight,
  Clock,
  Heart,
  Loader2,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAllRecipes,
  useFavorites,
  useRecipesByMood,
  useRegister,
  useToggleFavorite,
} from "./hooks/useQueries";

const MOODS = [
  { id: "Happy", emoji: "😄", label: "Happy" },
  { id: "Sad", emoji: "😔", label: "Sad" },
  { id: "Stressed", emoji: "😤", label: "Stressed" },
  { id: "Energetic", emoji: "⚡", label: "Energetic" },
  { id: "Relaxed", emoji: "😌", label: "Relaxed" },
  { id: "Tired", emoji: "😴", label: "Tired" },
];

const COLLECTIONS = [
  {
    id: "comfort",
    label: "Comfort Food 🫕",
    gradient: "linear-gradient(135deg, #B55A46 0%, #8B3A28 100%)",
  },
  {
    id: "energy",
    label: "Energy Boost ⚡",
    gradient: "linear-gradient(135deg, #C86B3C 0%, #E8941A 100%)",
  },
  {
    id: "stress",
    label: "Stress Relief 🍵",
    gradient: "linear-gradient(135deg, #2F5C43 0%, #4A8C60 100%)",
  },
  {
    id: "happy",
    label: "Happy Vibes 🌈",
    gradient: "linear-gradient(135deg, #C87462 0%, #E89B7C 100%)",
  },
];

const FALLBACK_RECIPES: Recipe[] = [
  {
    id: 1n,
    name: "Golden Turmeric Latte",
    description:
      "A warming blend of turmeric, ginger, and coconut milk to soothe and uplift your spirits.",
    emoji: "🧡",
    moodTags: ["Relaxed", "Tired"],
    prepTime: 5n,
    category: "Drinks",
  },
  {
    id: 2n,
    name: "Energizing Açaí Bowl",
    description:
      "Vibrant açaí base topped with fresh berries, granola, and honey for a natural energy kick.",
    emoji: "🫐",
    moodTags: ["Energetic", "Happy"],
    prepTime: 10n,
    category: "Breakfast",
  },
  {
    id: 3n,
    name: "Dark Chocolate Truffles",
    description:
      "Rich, velvety chocolate truffles that trigger serotonin and melt stress away.",
    emoji: "🍫",
    moodTags: ["Sad", "Stressed"],
    prepTime: 20n,
    category: "Dessert",
  },
  {
    id: 4n,
    name: "Rainbow Buddha Bowl",
    description:
      "A colorful medley of roasted veggies, chickpeas, and tahini dressing for all-day joy.",
    emoji: "🥗",
    moodTags: ["Happy", "Energetic"],
    prepTime: 25n,
    category: "Lunch",
  },
  {
    id: 5n,
    name: "Chamomile Honey Oats",
    description:
      "Creamy overnight oats infused with chamomile tea and local honey for deep calm.",
    emoji: "🌸",
    moodTags: ["Relaxed", "Stressed"],
    prepTime: 8n,
    category: "Breakfast",
  },
  {
    id: 6n,
    name: "Spicy Miso Ramen",
    description:
      "Hearty broth with umami-rich miso, noodles, and chili oil — pure comfort in a bowl.",
    emoji: "🍜",
    moodTags: ["Sad", "Tired"],
    prepTime: 30n,
    category: "Dinner",
  },
];

function RecipeCard({
  recipe,
  favoriteIds,
  onToggleFavorite,
  index,
}: {
  recipe: Recipe;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: bigint) => void;
  index: number;
}) {
  const isFav = favoriteIds.has(recipe.id.toString());
  const circleColors = [
    "#FFF0E6",
    "#E8F5EC",
    "#FDE8E5",
    "#F0EAD6",
    "#E6F0FF",
    "#FFF5E0",
  ];
  const bgColor = circleColors[index % circleColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow"
      data-ocid={`recipe.item.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {recipe.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base leading-tight">
            {recipe.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.moodTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {recipe.description}
      </p>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{Number(recipe.prepTime)} min prep</span>
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full flex-1 text-xs border-border hover:border-secondary"
          onClick={() => onToggleFavorite(recipe.id)}
          data-ocid={`recipe.toggle.${index + 1}`}
        >
          <Heart
            className={`w-3.5 h-3.5 mr-1 ${
              isFav ? "fill-secondary text-secondary" : ""
            }`}
          />
          {isFav ? "Saved" : "Favorite"}
        </Button>
        <Button
          size="sm"
          className="rounded-full flex-1 text-xs bg-primary text-primary-foreground hover:opacity-90"
          data-ocid={`recipe.view.${index + 1}`}
        >
          View Recipe
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function RecipeSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-3 w-1/4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export default function App() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { actor } = useActor();
  const { mutate: register } = useRegister();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalText = identity?.getPrincipal().toText() ?? "";
  const avatarInitials = principalText.slice(0, 5).toUpperCase();

  useEffect(() => {
    if (actor) {
      register();
    }
  }, [actor, register]);

  const { data: allRecipes, isLoading: allLoading } = useAllRecipes();
  const { data: moodRecipes, isLoading: moodLoading } =
    useRecipesByMood(activeMood);
  const { data: favorites } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  const displayRecipes = activeMood ? (moodRecipes ?? []) : (allRecipes ?? []);
  const isLoading = activeMood ? moodLoading : allLoading;

  const favoriteIds = new Set((favorites ?? []).map((r) => r.id.toString()));

  // Fall back to sample data if backend returns empty
  const recipes =
    displayRecipes.length > 0
      ? displayRecipes
      : isLoading
        ? []
        : FALLBACK_RECIPES.filter(
            (r) => !activeMood || r.moodTags.includes(activeMood),
          );

  const handleToggleFavorite = (id: bigint) => {
    if (!isAuthenticated) {
      toast("Sign in to save favorites", {
        description: "Create an account to keep your favorites across visits.",
      });
      return;
    }
    toggleFavorite(id, {
      onError: () => toast.error("Could not update favorites"),
      onSuccess: () => toast.success("Favorites updated!"),
    });
  };

  const navLinks = ["Home", "Features", "Recipes", "Blog", "Community"];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, oklch(0.93 0.04 75) 0%, oklch(0.956 0.022 85) 60%)",
      }}
    >
      <Toaster />

      {/* App Card Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-background rounded-3xl shadow-2xl overflow-hidden">
          {/* ── HEADER ── */}
          <header
            className="px-6 py-4 flex items-center justify-between border-b border-border"
            data-ocid="nav.section"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              <span className="font-display font-bold text-xl text-foreground tracking-tight">
                MoodFood
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="/"
                  className={`text-sm font-medium transition-colors ${
                    link === "Home"
                      ? "text-foreground border-b-2 border-terracotta pb-0.5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`nav.${link.toLowerCase()}.link`}
                >
                  {link}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #B55A46, #C86B3C)",
                    }}
                    title={principalText}
                    data-ocid="nav.user_avatar.panel"
                  >
                    {avatarInitials || <User className="w-4 h-4" />}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-sm gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => clear()}
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <Button
                  className="rounded-full bg-primary text-primary-foreground hover:opacity-90 text-sm px-5 hidden md:flex items-center gap-2"
                  onClick={() => login()}
                  disabled={isLoggingIn}
                  data-ocid="nav.login.button"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Sign In
                </Button>
              )}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-muted"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-ocid="nav.mobile_menu.toggle"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-card border-b border-border overflow-hidden"
              >
                <div className="px-6 py-4 flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="/"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                    >
                      {link}
                    </a>
                  ))}
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #B55A46, #C86B3C)",
                        }}
                      >
                        {avatarInitials || <User className="w-4 h-4" />}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full flex-1 gap-1.5"
                        onClick={() => {
                          clear();
                          setMobileMenuOpen(false);
                        }}
                        data-ocid="nav.mobile_logout.button"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="rounded-full bg-primary text-primary-foreground w-full mt-2 gap-2"
                      onClick={() => {
                        login();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingIn}
                      data-ocid="nav.mobile_login.button"
                    >
                      {isLoggingIn ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      Sign In
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── HERO ── */}
          <section
            className="relative overflow-hidden"
            style={{ minHeight: "380px" }}
          >
            {/* Terracotta left panel */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(105deg, #B55A46 0%, #B55A46 60%, transparent 100%)",
              }}
            />
            {/* Right photo */}
            <div
              className="absolute right-0 top-0 bottom-0 w-2/5 md:w-2/5 z-0"
              style={{
                backgroundImage: `url('/assets/generated/hero-cooking.dim_800x600.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Fade overlay on left edge of photo */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #B55A46 0%, transparent 40%)",
                }}
              />
            </div>

            {/* Hero content */}
            <div className="relative z-10 px-8 md:px-14 py-12 md:py-16 max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 mb-3"
              >
                ✨ Personalized Nutrition
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-3"
              >
                Eat for Your Mood
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/80 text-base md:text-lg mb-8 max-w-md"
              >
                Discover foods that match and boost how you feel
              </motion.p>

              {/* Mood Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
                  How are you feeling today?
                </p>
                <div className="flex flex-wrap gap-2" data-ocid="mood.selector">
                  {MOODS.map((mood) => (
                    <button
                      type="button"
                      key={mood.id}
                      onClick={() =>
                        setActiveMood((prev) =>
                          prev === mood.id ? null : mood.id,
                        )
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                      style={
                        activeMood === mood.id
                          ? {
                              background:
                                "linear-gradient(135deg, #C86B3C 0%, #B85A34 100%)",
                              color: "white",
                              boxShadow: "0 4px 12px rgba(200,107,60,0.45)",
                            }
                          : {
                              background: "rgba(255,255,255,0.18)",
                              color: "white",
                              backdropFilter: "blur(8px)",
                            }
                      }
                      data-ocid={`mood.${mood.id.toLowerCase()}.toggle`}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── FEATURED MOOD BOOSTERS ── */}
          <section className="px-6 md:px-10 py-12" data-ocid="recipes.section">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {activeMood
                  ? `${MOODS.find((m) => m.id === activeMood)?.emoji} ${activeMood} Mood Boosters`
                  : "Featured Mood Boosters"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {activeMood
                  ? `Recipes specially curated for when you're feeling ${activeMood.toLowerCase()}`
                  : "Hand-picked recipes to boost your wellbeing"}
              </p>
            </div>

            {isLoading ? (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
                data-ocid="recipes.loading_state"
              >
                {["s1", "s2", "s3"].map((sk) => (
                  <RecipeSkeleton key={sk} />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="recipes.empty_state"
              >
                <span className="text-4xl block mb-3">🍽️</span>
                <p className="font-medium">
                  No recipes found for this mood yet.
                </p>
                <p className="text-sm mt-1">Try selecting a different mood!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recipes.map((recipe, i) => (
                  <RecipeCard
                    key={recipe.id.toString()}
                    recipe={recipe}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={handleToggleFavorite}
                    index={i}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── HOW IT WORKS ── */}
          <section
            className="px-6 md:px-10 py-12"
            style={{ background: "oklch(0.93 0.015 80)" }}
          >
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                How It Works
              </h2>
              <p className="text-muted-foreground text-sm">
                Three simple steps to eating for your mood
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  emoji: "🎭",
                  step: "01",
                  title: "Pick Your Mood",
                  desc: "Tell us how you're feeling right now — happy, tired, stressed, or anything in between.",
                },
                {
                  emoji: "🍽️",
                  step: "02",
                  title: "Get Recommendations",
                  desc: "Our algorithm serves up personalized food and recipe suggestions matched to your emotional state.",
                },
                {
                  emoji: "🌟",
                  step: "03",
                  title: "Feel Better",
                  desc: "Eat your way to happiness. Every recipe is chosen to support your mood and nourish your body.",
                },
              ].map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45 }}
                  className="text-center"
                  data-ocid={`how.step.${i + 1}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-card shadow-card flex items-center justify-center text-3xl mx-auto mb-4">
                    {step.emoji}
                  </div>
                  <span className="text-xs font-bold text-terracotta uppercase tracking-widest">
                    Step {step.step}
                  </span>
                  <h3 className="font-semibold text-foreground text-lg mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── RECIPE COLLECTIONS ── */}
          <section className="px-6 md:px-10 py-12">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                Recipe Collections
              </h2>
              <p className="text-muted-foreground text-sm">
                Curated sets for every feeling
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COLLECTIONS.map((col, i) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ height: "160px", background: col.gradient }}
                  data-ocid={`collections.item.${i + 1}`}
                >
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="text-white font-semibold text-sm leading-tight drop-shadow-md">
                      {col.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="border-t border-border px-6 md:px-10 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍜</span>
                <span className="font-display font-bold text-foreground">
                  MoodFood
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  — Eat for your mood
                </span>
              </div>

              <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {["Privacy", "Terms", "About", "Contact", "Blog"].map(
                  (link) => (
                    <a
                      key={link}
                      href="/"
                      className="hover:text-foreground transition-colors"
                      data-ocid={`footer.${link.toLowerCase()}.link`}
                    >
                      {link}
                    </a>
                  ),
                )}
              </nav>

              <div className="text-xs text-muted-foreground text-center md:text-right">
                © {new Date().getFullYear()} MoodFood. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  className="hover:text-foreground transition-colors underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  caffeine.ai
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
