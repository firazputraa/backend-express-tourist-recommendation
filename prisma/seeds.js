import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Karena menggunakan ES Modules ("type": "module"), kita perlu membuat variabel __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importPlaces() {
  try {
    const dataPath = path.join(
      __dirname,
      "dataset_wisata_gabungan_cleaned_final_1.2.json",
    );
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    const places = JSON.parse(jsonData);
    console.log(`Memulai proses import ${places.length} tempat wisata...`);
    let importedCount = 0;
    for (const placeData of places) {
      try {
        await prisma.place.upsert({
          where: { placeId: placeData.placeId },
          update: {
            place_name: placeData.place_name,
            imageUrl: placeData.imageUrl,
            tag: placeData.tag,
            description: placeData.description,
            address: placeData.address,
            rating: placeData.rating || 0,
            reviews: placeData.reviews || 0,
            features: placeData.features || [], 
            latitude: placeData.latitude,
            longitude: placeData.longitude,
          },
          create: {
            placeId: placeData.placeId,
            place_name: placeData.place_name,
            imageUrl: placeData.imageUrl,
            tag: placeData.tag,
            description: placeData.description,
            address: placeData.address,
            rating: placeData.rating || 0,
            reviews: placeData.reviews || 0,
            features: placeData.features || [],
            latitude: placeData.latitude,
            longitude: placeData.longitude,
          },
        });
        importedCount++;
        if (importedCount % 10 === 0) {
          console.log(`Berhasil mengimpor ${importedCount} wisata...`);
        }
      } catch (error) {
        console.error(
          `Gagal mengimpor wisata ${placeData.place_name || "unknown"}:`,
          error.message,
        );
      }
    }
    console.log(
      `Selesai! Berhasil mengimpor/memperbarui total ${importedCount} destinasi wisata.`,
    );
  } catch (error) {
    console.error("Terjadi kesalahan sistem saat membaca file JSON:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importPlaces();
