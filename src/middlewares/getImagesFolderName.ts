import prismaClient from '../prisma';

export async function getFolderName(category_id: string) {
  let folderName = '';
  const category = await prismaClient.category.findUnique({
    where: {
      id: category_id,
    },
  });

  if (category) {
    folderName = category?.name;
  }

  return folderName;
}
