This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). 
This project is a game that uses an external API to interact with game state. The frontend rendering is implemented with Reactjs library. You can find deployed version of this game here: 
[https://save-the-pony.vercel.app](https://save-the-pony.vercel.app)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Run the tests:

```bash
npm run test --watch
# or
yarn test --watch
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Notes

This is not a "production ready" code but it's good enough to show a general approach to code architecture, usability, responsiveness, design, performance optimizations, etc. This project should be a conversation starter to discuss the frontend application challenges and possible solutions. 

## TODO

- [ ] Improve test coverage (unit tests, integration, cypress)
- [ ] Improve performance swaping inline-styles to CSS classes, CSS modules or CSS-in-JS
- [ ] Improve folder structure, split components to separate folders/files
- [ ] Improve async code error handling
- [ ] Separate prod and dev environments
- [ ] Add CI/CD
- [ ] Maybe less verbose code could be achieved implementing React Context API
