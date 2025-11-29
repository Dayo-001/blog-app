export const dynamic = "force-dynamic";
import { prisma } from "@/src/lib/prisma";
import SearchClient from "../components/desktop/SearchClient";

const HomePage = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      tags: true,
      author: { select: { name: true, image: true } },
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 px-2 sm:px-4 py-4 sm:py-8 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Latest Posts
      </h1>
      <SearchClient posts={posts} />
    </div>
  );
};
export default HomePage;
