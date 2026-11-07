import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, MessageSquareText, Send, X } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translatePropertyText } from '../translations';
import { Property } from '../types';

interface AssistantTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  matchedProperties?: Property[];
}

/**
 * Section 13 — AI Property Assistant Demo:
 * Floating assistant interface using deterministic mock-data matching.
 * Does not require an external AI API and strictly never invents properties outside publicProperties.
 */
export const PropertyAssistantWidget: React.FC = () => {
  const { t, language, publicProperties, formatPrice } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [turns, setTurns] = useState<AssistantTurn[]>([]);

  const runMockDataMatch = (rawInput: string) => {
    const q = rawInput.toLowerCase().trim();
    if (!q) return;

    const scored = publicProperties.map((prop) => {
      let score = 0;
      const localized = translatePropertyText(prop.id, language, {
        title: prop.title,
        subtitle: prop.subtitle,
        description: prop.description
      });
      const haystack = [
        prop.title,
        prop.subtitle || '',
        localized.title,
        localized.subtitle || '',
        localized.description,
        prop.category,
        prop.listingType,
        prop.location.city,
        prop.location.neighborhood,
        prop.location.country,
        prop.description,
        ...prop.amenities
      ]
        .join(' ')
        .toLowerCase();

      const words = q.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (haystack.includes(w)) score += 3;
      }

      if (
        (q.includes('wedding') ||
          q.includes('event') ||
          q.includes('gala') ||
          q.includes('party') ||
          q.includes('mariage') ||
          q.includes('maryaj') ||
          q.includes('boda') ||
          q.includes('événement') ||
          q.includes('evenman')) &&
        prop.listingType === 'event'
      ) {
        score += 8;
      }
      if (
        (q.includes('land') ||
          q.includes('lot') ||
          q.includes('terrain') ||
          q.includes('parcel') ||
          q.includes('teren') ||
          q.includes('terreno')) &&
        prop.listingType === 'land'
      ) {
        score += 8;
      }
      if (
        (q.includes('rent') ||
          q.includes('lease') ||
          q.includes('monthly') ||
          q.includes('louer') ||
          q.includes('lwe') ||
          q.includes('alquiler')) &&
        prop.listingType === 'rent'
      ) {
        score += 8;
      }
      if (
        (q.includes('buy') ||
          q.includes('sale') ||
          q.includes('villa') ||
          q.includes('house') ||
          q.includes('acheter') ||
          q.includes('achte') ||
          q.includes('venta')) &&
        prop.listingType === 'sale'
      ) {
        score += 5;
      }

      return { prop, score };
    });

    const matches = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.prop);

    const responseText =
      matches.length > 0
        ? `${t.assistant.foundMatches} (${matches.length})`
        : t.assistant.noExactMatch;

    const finalMatches = matches.length > 0 ? matches : publicProperties.slice(0, 2);

    setTurns((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: rawInput },
      {
        id: `a-${Date.now() + 1}`,
        role: 'assistant',
        text: responseText,
        matchedProperties: finalMatches
      }
    ]);
    setQuery('');
  };

  const quickPrompts = [
    t.assistant.prompt1,
    t.assistant.prompt2,
    t.assistant.prompt3,
    t.assistant.prompt4
  ];

  const allTurns: AssistantTurn[] = [
    {
      id: 'welcome',
      role: 'assistant',
      text: t.assistant.welcomeMessage,
      matchedProperties: publicProperties.slice(0, 2)
    },
    ...turns
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[520px]">
          <div className="bg-[#1150EF] text-white px-4 py-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 shrink-0" />
              <div>
                <h3 className="font-ui text-xs font-bold uppercase tracking-wider">
                  {t.assistant.title}
                </h3>
                <p className="text-[10px] text-white/80">
                  {t.assistant.subtitle} ({publicProperties.length})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.modals.close}
              className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="p-3.5 overflow-y-auto flex-1 space-y-3 bg-neutral-50">
            {allTurns.map((turn) => (
              <div
                key={turn.id}
                className={`flex flex-col ${
                  turn.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-xs font-body leading-relaxed ${
                    turn.role === 'user'
                      ? 'bg-[#1150EF] text-white'
                      : 'bg-white text-[#161616] border border-neutral-200/80 shadow-2xs'
                  }`}
                >
                  {turn.text}
                </div>

                {turn.matchedProperties && turn.matchedProperties.length > 0 && (
                  <div className="mt-2 w-full space-y-1.5">
                    {turn.matchedProperties.map((p) => {
                      const localized = translatePropertyText(p.id, language, {
                        title: p.title,
                        subtitle: p.subtitle,
                        description: p.description
                      });
                      return (
                        <Link
                          key={p.id}
                          to={`/property/${p.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200 hover:border-[#1150EF] transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="font-display text-xs font-semibold text-[#0D0D0D] truncate">
                              {localized.title}
                            </div>
                            <div className="text-[11px] font-ui text-[#737373] truncate">
                              {p.location.city} ·{' '}
                              <strong className="text-[#1150EF] tabular-nums">
                                {formatPrice(p.priceUSD, p.priceUnit)}
                              </strong>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#1150EF] shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => runMockDataMatch(prompt)}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-[#1150EF]/10 hover:text-[#1150EF] text-[11px] font-ui font-medium text-[#161616] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runMockDataMatch(query);
            }}
            className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.assistant.inputPlaceholder}
              className="flex-1 h-9 px-3 rounded-lg bg-neutral-100 text-xs font-body text-[#161616] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1150EF]"
            />
            <button
              type="submit"
              aria-label={t.assistant.buttonLabel}
              className="h-9 px-3 rounded-lg bg-[#1150EF] hover:bg-[#135AF3] text-white flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-12 px-4 rounded-full bg-[#0D0D0D] hover:bg-[#1150EF] text-white shadow-xl border border-white/15 inline-flex items-center gap-2 font-ui text-xs font-semibold transition-all cursor-pointer"
        >
          <MessageSquareText className="w-4 h-4 text-[#76A2FA]" />
          <span>{t.assistant.buttonLabel}</span>
        </button>
      )}
    </div>
  );
};
