<a href='https://www.linkedin.com/in/alexander-knips-45794240/' target="_blank"><img alt='LinkedIn' src='https://img.shields.io/badge/Alexander_Knips-100000?style=for-the-badge&logo=LinkedIn&logoColor=white&labelColor=0077B5&color=0077B5'/></a>![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)<a href='https://xtermjs.org/' target="_blank"><img alt='' src='https://img.shields.io/badge/Xtermjs-100000?style=for-the-badge&logo=&logoColor=white&labelColor=649CBA&color=578EAA'/></a>![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

# 1. Project Description
This is an interactive terminal based CV built with
- Written in [Typescript](https://www.typescriptlang.org/)
- [Nest JS](https://nextjs.org/)
- [OpenAI API](https://openai.com/product)
- XtermJS [XtermJS](https://xtermjs.org/)
- Deployed to [Vercel](https://vercel.com)

# 3. Architecture
I believe that the (C4 Model)[https://c4model.com/] currently is the best way to describe architecture through diagrams. Hence, it will be used here as appropriate. 

```mermaid
C4Context

    title System Context diagram for Terminal AI Resume 
    Person(admin, "Administrator")

    System_Boundary(sys, "CV System") {
        Container(web_app, "Web Application", "Typescript, NextJS", "Allows the user to ask questions about the particular resume in question <br> and display pre-defined employment and education histories.")
        Person(user, "User")
        Rel(user, web_app, "Interacts", "Web")
    }
    System(openai, "Open AI")

    Rel(admin, openai, "Configures the GPT assistant", "Web")
    Rel(web_app, openai, "Interacts with the CV Web page", "Web")
    UpdateRelStyle(admin, openai, $offsetY="20")
    UpdateRelStyle(web_app, openai, $offsetY="-20")
    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

# 4. How to Install and Run the Project

## Running the server locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 5. How to Use the Project

Feel free to use this project according to the MIT license. Accredication not required but appreciated.

# 6. Credits

Thank you vercel and the NextJS project for getting started quickly. See: [https://vercel.com/solutions/nextjs](NextJS Vercel page) and [https://github.com/vercel/next.js](NextJS Github).
