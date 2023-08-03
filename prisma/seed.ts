import { PrismaClient, QuestionType } from "@prisma/client";
import questions from "../public/dev-questions.json" 
import { hashPassword } from "../src/lib/auth/password-utils";
import axios from "axios";

const prisma = new PrismaClient();
const password = "password";
const seedSize = 100;
const matchmakerSize = 5;
const api_base_url = "https://random-data-api.com/api/v2/users";

type UserFromApi = {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "CLIENT" | "MATCHMAKER";
  phone_number: string;
  date_of_birth: string;
  avatar: string;
};


const getRandomQuestionType = () => {
  const questionTypes = [
    "PERSONALITY", "PREFERENCE", "BIO", "RELIGION", "LIFESTYLE", "BACKGROUND", "OTHER", "LOOKINS_FOR"
  ] as QuestionType[]
  const randomIndex = Math.floor(Math.random() * questionTypes.length)
  return questionTypes[randomIndex]
}

async function main() {
  // users seed
  try {
    const password_hash = await hashPassword(password);
    // seed admins
    const admins = await prisma.user.create({
      data: {
        email: "shmuelbisberg@gmail.com",
        password_hash,
        firstName: "Shmuel",
        lastName: "Bisberg",
        role: "ADMIN",
        phoneNumber: "054-123-4567",
        admin: {
          create: {},
        },
      },
    });

    const { data: randomUsers } = await axios.get<UserFromApi[]>(api_base_url, {
      params: { size: seedSize },
    });

    randomUsers.forEach(async (user, i) => {
      const role: "CLIENT" | "MATCHMAKER" =
        i < matchmakerSize ? "MATCHMAKER" : "CLIENT";
      if (role === "CLIENT") {
        const userFromDb = await prisma.user.create({
          data: {
            phoneNumber: user.phone_number,
            email: user.email,
            password_hash,
            image: user.avatar,
            firstName: user.first_name,
            lastName: user.last_name,
            role,
            client: {
              create: {
                gender: i % 2 === 0 ? "FEMALE" : "MALE",
                birthday: new Date(Date.parse(user.date_of_birth)),
                category: "SINGLE",
              },
            },
          },
        });
        console.log(userFromDb);
      } else {
        const res = await prisma.user.create({
          data: {
            phoneNumber: user.phone_number,
            email: user.email,
            password_hash,
            image: user.avatar,
            firstName: user.first_name,
            lastName: user.last_name,
            role,
            matchmaker: {
              create: {
                adminAuthorizerId: admins.id,
              },
            },
          },
        });
        console.log(res);
      }
    });
  } catch (e) {
    console.log("Error while seeding users: ", e);
  }

  // questions seed
  try {
    questions.forEach(async (q, i) => {
      const dbQuestion = await prisma.question.create({
        data: {
          text: q.question,
          description: i % 2 === 0 ? "Non id sint enim officia esse excepteur id exercitation. Sit anim ipsum deserunt nostrud commodo" : undefined,
          type: getRandomQuestionType(),
          options: {
            create: [q.correct_answer, ...q.incorrect_answers].map(opt => ({
              text: opt,
            }))
          }
        }
      })
      console.log(dbQuestion)
    })
  } catch (e) {
    console.log("Error while seeding questions: ", e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
