import type { Notice } from "../../features/notices/types";
import { Card } from "../ui";

type NoticeCardProps = {
  notice: Notice;
};

export function NoticeCard({ notice }: NoticeCardProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(notice.createdAt));

  return (
    <Card className="border-l-4 border-l-[#2f6f5e] p-5" padding="none">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#12213a]">
            {notice.title}
          </h2>

          <p className="mt-1 text-xs text-[#66768a]">
            Publicado por {notice.author.name}
          </p>
        </div>

        <span className="text-xs font-medium text-[#66768a]">
          {formattedDate}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#526173]">
        {notice.content}
      </p>
    </Card>
  );
}
