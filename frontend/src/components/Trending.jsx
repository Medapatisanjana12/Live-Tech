import { TrendingUp, Sparkles } from 'lucide-react';

export default function Trending({ tools }) {
  // Get top 5 tools by created_at (since votes are removed)
  const trendingTools = [...(tools || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (!trendingTools.length) return null;

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-white tracking-wide">TRENDING NOW</h3>
      </div>

      <div className="space-y-4">
        {trendingTools.map((tool, index) => (
          <div 
            key={tool.id || index} 
            className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:border-primary/50 transition-colors">
              #{index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-200 truncate group-hover:text-primary transition-colors">
                {tool.name || tool.ToolName || 'Unnamed'}
              </h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {tool.tagline || 'Latest AI innovation'}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="h-3 w-3 mr-1" />
              Hot
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
