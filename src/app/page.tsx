import { prisma } from "@/src/lib/prisma";
import SearchClient from "../components/desktop/SearchClient";

const HomePage = async () => {
  // Fetch ONLY published posts
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
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>

      <SearchClient posts={posts} />
    </div>
  );
};
export default HomePage;
