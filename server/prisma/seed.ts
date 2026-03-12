// using pre configured client
import prisma from "../src/config/database";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data (optional)
  await prisma.$transaction([
    prisma.propertyEmbedding.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.rentAgreement.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.visitSchedule.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.propertyImage.deleteMany(),
    prisma.property.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "test_user_1",
        email: "tenant@example.com",
        fullName: "Rahul Sharma",
        role: "TENANT",
        isVerified: true,
        phone: "+919876543210",
        avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    }),
    prisma.user.create({
      data: {
        id: "test_user_2",
        email: "landlord@example.com",
        fullName: "Amit Kumar",
        role: "LANDLORD",
        isVerified: true,
        phone: "+919876543211",
        avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      },
    }),
    prisma.user.create({
      data: {
        id: "test_user_3",
        email: "admin@example.com",
        fullName: "Priya Singh",
        role: "ADMIN",
        isVerified: true,
        phone: "+919876543212",
        avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    }),
  ]);

  console.log(
    "✅ Created users:",
    users.map((u) => u.email)
  );

  // Create properties for landlord
  const properties = await Promise.all([
    // Property 1: 2BHK in Whitefield
    prisma.property.create({
      data: {
        landlordId: "test_user_2",
        title: "Modern 2BHK in Whitefield",
        description:
          "Spacious 2BHK apartment with modern amenities located in the heart of Whitefield. Perfect for families and working professionals. The apartment features a large balcony with garden view, modular kitchen, and ample natural light. Located close to IT parks, schools, and hospitals.",
        bhk: "TWO_BHK",
        rent: 25000,
        furnishing: "SEMI_FURNISHED",
        tenantType: "FAMILY",
        isBroker: false,
        addressLine1: "123, Oakwood Residency",
        addressLine2: "Whitefield Main Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        latitude: 12.9698,
        longitude: 77.7499,
        hasWater247: true,
        hasPowerBackup: true,
        hasIglPipeline: false,
        nearestMetroStation: "Baiyappanahalli",
        distanceToMetroKm: 1.2,
        images: {
          create: [
            {
              imageUrl:
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
              isPrimary: true,
              sortOrder: 0,
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
              isPrimary: false,
              sortOrder: 1,
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
      },
      include: { images: true },
    }),

    // Property 2: 1BHK near Metro
    prisma.property.create({
      data: {
        landlordId: "test_user_2",
        title: "Cozy 1BHK near Metro Station",
        description:
          "Perfect for bachelors and working professionals. Fully furnished apartment with modern interiors. Just a 5-minute walk from the metro station. Close to shopping centers and restaurants.",
        bhk: "ONE_BHK",
        rent: 18000,
        furnishing: "FULLY_FURNISHED",
        tenantType: "BACHELORS",
        isBroker: true,
        brokerageFee: 18000,
        addressLine1: "456, Lakeview Apartments",
        addressLine2: "Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        latitude: 12.9784,
        longitude: 77.6408,
        hasWater247: true,
        hasPowerBackup: false,
        hasIglPipeline: true,
        nearestMetroStation: "Indiranagar",
        distanceToMetroKm: 0.5,
        images: {
          create: [
            {
              imageUrl:
                "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800",
              isPrimary: true,
              sortOrder: 0,
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800",
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        },
      },
      include: { images: true },
    }),

    // Property 3: Luxury 3BHK in Koramangala
    prisma.property.create({
      data: {
        landlordId: "test_user_2",
        title: "Luxury 3BHK with Terrace Garden",
        description:
          "Premium 3BHK apartment with exclusive terrace garden. Features high-end finishes, modern kitchen with IGL connection, and 24/7 security. Perfect for large families.",
        bhk: "THREE_BHK",
        rent: 45000,
        furnishing: "FULLY_FURNISHED",
        tenantType: "FAMILY",
        isBroker: false,
        addressLine1: "789, Green Heights",
        addressLine2: "Koramangala 5th Block",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560095",
        latitude: 12.9352,
        longitude: 77.6245,
        hasWater247: true,
        hasPowerBackup: true,
        hasIglPipeline: true,
        nearestMetroStation: "MG Road",
        distanceToMetroKm: 2.8,
        images: {
          create: [
            {
              imageUrl:
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
              isPrimary: true,
              sortOrder: 0,
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
              isPrimary: false,
              sortOrder: 1,
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800",
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
      },
      include: { images: true },
    }),
  ]);

  console.log("✅ Created properties:", properties.length);

  // Create wishlist for tenant
  await prisma.wishlist.create({
    data: {
      tenantId: "test_user_1",
      propertyId: properties[0].id,
    },
  });

  console.log("✅ Created wishlist");

  // Create visit schedule
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.visitSchedule.create({
    data: {
      tenantId: "test_user_1",
      propertyId: properties[1].id,
      scheduledDate: tomorrow,
      scheduledTime: "11:00",
      status: "CONFIRMED",
      notes: "Interested in seeing the apartment",
    },
  });

  console.log("✅ Created visit schedule");

  // Create leads
  await prisma.lead.create({
    data: {
      tenantId: "test_user_1",
      propertyId: properties[2].id,
      contactMethod: "WHATSAPP",
      message: "Is this property still available?",
      status: "NEW",
    },
  });

  console.log("✅ Created leads");

  // Create analytics events
  await prisma.analyticsEvent.createMany({
    data: [
      { eventType: "page_view", userId: "test_user_1" },
      {
        eventType: "property_view",
        userId: "test_user_1",
        propertyId: properties[0].id,
      },
      {
        eventType: "property_view",
        userId: "test_user_1",
        propertyId: properties[1].id,
      },
      {
        eventType: "search",
        userId: "test_user_1",
        metadata: { query: "2BHK Whitefield" },
      },
    ],
  });

  console.log("✅ Created analytics events");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
