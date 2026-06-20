import type { Notice } from "../../features/notices/types";

type NoticeCardProps = {
  notice: Notice;
};

export function NoticeCard({ notice }: NoticeCardProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(notice.createdAt));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {notice.title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Publicado por {notice.author.name}
          </p>
        </div>

        <span className="text-xs text-slate-500">{formattedDate}</span>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
        {notice.content}
      </p>
    </article>
  );
}