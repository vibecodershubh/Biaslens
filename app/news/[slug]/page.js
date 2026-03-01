import FloatingChat from "@/components/FloatingChat";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }) {
  const resolvedSearchParams = await searchParams;
  return {
    title: `BiasLens | ${resolvedSearchParams.title || params.slug}`,
    description: "Detailed cognitive analysis of news reporting bias.",
  };
}

export default async function ArticlePage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.title || !resolvedSearchParams.url) {
    notFound();
  }

  // Normally, we'd fetch the article content or scrape it via an API proxy. 
  // For the scope of this clone, the article context passed to GPT will be the title and URL.
  const articleContext = `Please read the article at ${resolvedSearchParams.url} and summarize the core framing bias, potential political tilt, and emotional manipulation tactics. Title: ${resolvedSearchParams.title}`;

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/news" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-semibold mb-12">
        <ArrowLeft className="w-4 h-4" />
        BACK TO FEED
      </Link>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-bold tracking-wider text-indigo-400">
              TARGET ACQUIRED
            </span>
          </div>
          <span className="text-zinc-500 text-sm font-mono">{format(new Date(), "PP")}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white mb-6">
          {resolvedSearchParams.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-8 mb-8">
          <a
            href={resolvedSearchParams.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-xl active:scale-95 transition-all w-fit"
          >
            READ FULL SOURCE <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-lg">
          <p className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
            <span>
              The Cognitive Analysis Engine has isolated this media artifact. Initialize the Neural Link widget below to commence comprehensive bias extraction.
            </span>
          </p>
        </div>
      </div>

    </main>
  );
}
