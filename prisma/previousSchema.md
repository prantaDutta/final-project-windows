generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model borrowers {
  id        Int       @id @default(autoincrement())
  userId    Int
  createdAt DateTime?
  updatedAt DateTime?
  users     users     @relation(fields: [userId], references: [id])
  loans     loans[]
}

model lenders {
  id        Int       @id @default(autoincrement())
  userId    Int
  createdAt DateTime?
  updatedAt DateTime?
  users     users     @relation(fields: [userId], references: [id])
  loans     loans[]
}

model loans {
  id                               Int         @id @default(autoincrement())
  lenderIds                        Json
  lenderId                         Int
  borrowerId                       Int
  userId                           Int
  loanMode                         String
  loanDuration                     String
  amount                           Int
  interestRate                     Int
  amountWithInterest               Int
  companyFees                      Int
  amountWithInterestAndCompanyFees Int
  monthlyInstallment               Int
  loanStartDate                    DateTime
  loanEndDate                      DateTime
  createdAt                        DateTime?
  updatedAt                        DateTime?
  borrowers                        borrowers   @relation(fields: [borrowerId], references: [id])
  lenders                          lenders     @relation(fields: [lenderId], references: [id])
  users                            users       @relation(fields: [userId], references: [id])
  penalties                        penalties[]
  wallets                          wallets[]
}

model penalties {
  id            Int       @id @default(autoincrement())
  userId        Int
  loanId        Int
  month         String
  year          String
  penaltyAmount Int
  createdAt     DateTime?
  updatedAt     DateTime?
  loans         loans     @relation(fields: [loanId], references: [id])
  users         users     @relation(fields: [userId], references: [id])
}

model users {
  id                 Int               @id @default(autoincrement())
  name               String
  email              String            @unique
  emailVerifiedAt    DateTime?
  dateOfBirth        DateTime
  password           String
  role               String
  gender             String
  address            String?
  verified           String            @default("false")
  borrowerType       String?
  verificationNo     String?
  verificationPhotos Json?
  createdAt          DateTime?
  updatedAt          DateTime?
  borrowers          borrowers[]
  lenders            lenders[]
  loans              loans[]
  password_resets    password_resets[]
  penalties          penalties[]
  wallets            wallets[]
}

model wallets {
  id        Int       @id @default(autoincrement())
  userId    Int
  loanId    Int
  balance   Int
  type      String
  createdAt DateTime?
  updatedAt DateTime?
  loans     loans     @relation(fields: [loanId], references: [id])
  users     users     @relation(fields: [userId], references: [id])
}

model password_resets {
  id         Int       @id @default(autoincrement())
  userId     Int
  email      String
  token      String
  created_at DateTime?
  users      users     @relation(fields: [userId], references: [id])

  @@index([email], name: "password_resets_email_index")
}

model laravel_migrations {
  id        Int    @id @default(autoincrement())
  migration String
  batch     Int
}

enum Role {
  admin
  borrower
  lender
}
