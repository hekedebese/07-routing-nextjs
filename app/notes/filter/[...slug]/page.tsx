import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Notes({ params }: Props) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () =>
      getNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
