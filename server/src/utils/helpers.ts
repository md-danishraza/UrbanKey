// # Helper functions
import prisma from "../config/database.js";

export async function generateAgreementNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AGR/${year}/`;

  const lastAgreement = await prisma.rentalAgreement.findFirst({
    where: {
      agreementNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      agreementNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (lastAgreement) {
    const lastNumber = parseInt(
      lastAgreement.agreementNumber.split("/").pop() || "0"
    );
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}
