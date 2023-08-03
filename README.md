# Dating App CRM

A centralized app for all your clients, dates, and appointments.

### about the architecture

This app is a mono-ripo using app dir [Next.js 13.4](https://www.nextjs.org).
It uses [Typescript](https://www.typescriptlang.org/) and [Tailwind CSS](https://www.tailwindcss.com/) for styling.
these are the main used in the app the additional libraries are listed below.

### about the libraries

* It uses [Mysql](https://dev.mysql.com/doc/) database.
* It uses [Prisma](https://www.prisma.io/) as an ORM.
* It uses [NextAuth](https://www.next-auth.js.org/) for authentication and authorization.
* It uses [React Hook Form](https://www.react-hook-form.com/) for form handling.
* It uses [Zod](https://www.npmjs.com/package/zod) for validation.
* It uses [Shedcon UI](https://ui.shadcn.com/) for styling.
* It uses [Docker](https://www.docker.com/) for containerization.
* It uses [Docker Compose](https://www.docker.com/compose) for local development.
* It uses [ESLint](https://www.eslint.org/) for linting.
* It uses [Prettier](https://www.prettier.io/) for code formatting.

### getting started

Make sure you have on your machine:

* <input type="checkbox" checked> [Node.js](https://nodejs.org/en/)
* <input type="checkbox" checked> [Git](https://git-scm.com/)
* <input type="checkbox">  [Docker](https://www.docker.com/)
* <input type="checkbox"> [Docker Compose](https://docs.docker.com/compose/install/)

**Make sure you  don't have any app running on ports: 3306, 8080, 3000.** 

And then, rin the following commands

1. Clone the repo <code>git clone ghttps://github.com/FS-JCT-2023/dating-app.git</code>.

2. Change directory <code>cd dating-app</code>.

3. Install dependencies <code>npm install</code>.

4. Get docker containers up and running <code>docker-compose up -d</code>.

5. Migrate the database with <code>npx prisma migrate dev</code> and <code>npx prisma db push</code>.

5. Run the app<code>npm run dev</code>.

6. Open your browser http://localhost:3000

7. Stop the containers (if you wanna) <code>docker-compose down</code>.


#### bonus
Seed your local database with fake user to play with. Run <code>npx prisma db seed</code>.
And login as admin at http://localhost:3000/sign-in/admin with the following credentials:
* email: shmuelbisberg@gmail.com
* password: password

### Analyzing & Manipulating with Adminer
This app runs on a container. It's already running if you followed the steps above.

Go to http://localhost:8080/ and login with the following credentials:
* user: root
* password: password

There you can see, and CRUD the database.


### Fetch components from [shedcon/ui](https://ui.shadcn.com/)

Browse the  [shedcon/ui](https://ui.shadcn.com/docs/components/) website and copy the component you want to use.

There you'll see the commend's you'll need to run to install the component.

after installation, the component will be available at <code>/components/ui</code> directory.

**note! file imports are with <code>"@/*"</code> aliases**

for example:
```typescript
import { Button } from "@/components/ui/button";
// do stuff...
```


