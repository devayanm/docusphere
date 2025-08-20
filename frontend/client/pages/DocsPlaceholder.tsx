import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  DocumentTextIcon,
  PlusIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function DocsPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <div className="mb-8">
        <DocumentTextIcon className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Documentation Page
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          This documentation page is being created. The sidebar navigation shows the structure, 
          and you can start editing content using our rich text editor.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
        <div className="bg-card border border-border rounded-lg p-6 text-left">
          <PlusIcon className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-semibold mb-2">Create Content</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Use our powerful rich text editor to create beautiful documentation with Markdown support.
          </p>
          <Link to="/editor">
            <Button size="sm">
              Start Writing
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 text-left">
          <RocketLaunchIcon className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Continue prompting to build out this page with real content and features.
          </p>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          This is a placeholder page. The real content will be populated as you continue 
          building your DocuSphere documentation platform.
        </p>
      </div>
    </div>
  );
}
