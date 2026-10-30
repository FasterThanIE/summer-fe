"use client";

import { aiErrorText, aiNoticeText } from "@/lib/ai-search/present";
import { useLastSearch } from "@/lib/ai-search/last-search";

export function SearchNotices({ unknownPlaces, unknownAmenities }: { unknownPlaces: string[]; unknownAmenities: string[] }) {
  const { errors, notices } = useLastSearch();
  const messages = [
    ...errors.map((error) => ({ text: aiErrorText(error), isError: true })),
    ...notices.map((notice) => ({ text: aiNoticeText(notice), isError: false })),
    ...unknownPlaces.map((name) => ({ text: `Nismo pronašli mesto ${name}.`, isError: false })),
    ...unknownAmenities.map((name) => ({ text: `Nismo pronašli sadržaj „${name}“.`, isError: false })),
  ];

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="notices" role="status">
      {messages.map((message) => (
        <p key={message.text} className={`notices__item${message.isError ? " notices__item--error" : ""}`}>
          {message.text}
        </p>
      ))}
    </div>
  );
}
