import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle"; 
import {
  BookOpenIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ShareIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: DocumentTextIcon,
    title: "Rich Text Editing",
    description:
      "Powerful Markdown and rich text editor with real-time collaboration",
  },
  {
    icon: Cog6ToothIcon,
    title: "Drag & Drop Navigation",
    description:
      "Intuitive sidebar with drag-and-drop reordering for pages and folders",
  },
  {
    icon: UserGroupIcon,
    title: "Team Collaboration",
    description: "Role-based permissions and real-time collaborative editing",
  },
  {
    icon: CodeBracketIcon,
    title: "Developer Friendly",
    description:
      "REST & GraphQL APIs, GitHub sync, and direct React integration",
  },
  {
    icon: LightBulbIcon,
    title: "Smart Search",
    description: "Fuzzy search across all documentation with instant results",
  },
  {
    icon: ShareIcon,
    title: "Version Control",
    description: "Auto-save with version history and one-click rollbacks",
  },
];

const benefits = [
  "Self-hostable and fully customizable",
  "Open source with plugin system",
  "Fast, responsive, and mobile-friendly",
  "Import/Export Markdown & JSON",
  "Dark/Light theme support",
  "Docs-as-code workflows",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                DocuSphere
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/editor">
                <Button>
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              The Modern
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                GitBook{" "}
              </span>
              Alternative
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              DocuSphere is an open-source, extensible, and developer-friendly
              documentation platform. Self-hostable, customizable, and built for
              teams that want full control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/editor">
                <Button size="lg" className="text-lg px-8 py-3">
                  <RocketLaunchIcon className="mr-2 h-5 w-5" />
                  Try the Editor
                </Button>
              </Link>
              <a
                href="https://github.com/devayanm/docusphere"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <StarIcon className="mr-2 h-5 w-5" />
                  Star on GitHub
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Open Source
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Self-Hostable
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Developer Friendly
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and share beautiful
              documentation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Built for Modern Teams
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                DocuSphere combines the best of GitBook and Notion, giving you
                complete control over your documentation workflow.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="text-center">
                <BookOpenIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Experience the power of DocuSphere with our interactive editor
                  and sidebar navigation.
                </p>
                <Link to="/editor">
                  <Button size="lg" className="w-full">
                    Launch Editor
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpenIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                DocuSphere
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ for modern documentation workflows
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
