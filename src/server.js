// const express = require("express") // OLD SYNTAX (we don't want to use old stuff)
import express from "express" // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import usersRouter from "./apis/users/index.js"
import booksRouter from "./apis/books/index.js"
import { badRequestHandler, notFoundHandler, unauthorizedHandler, genericServerErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 3001

// *************************************** MIDDLEWARES ***********************************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} -- Request URL: ${req.url} -- ${new Date()}`)
  console.log("Req body: ", req.body)
  // const check = true
  // if (check) {
  //   res.status(400).send({ message: "ERRORRRRRRRRRRRRR" })
  // } else {
  //   next()
  // }
  next()
}

server.use(cors()) // If you want to connect FE to this BE you must use cors middleware
server.use(loggerMiddleware) // GLOBAL MIDDLEWARE
server.use(express.json()) // GLOBAL MIDDLEWARE If you don't add this line BEFORE the endpoints all requests'bodies will be UNDEFINED

// **************************************** ENDPOINTS ************************************
server.use("/users", usersRouter) // /users will be the prefix that all the endpoints in the usersRouter will have
server.use("/books", loggerMiddleware, booksRouter) // ROUTER LEVEL MIDDLEWARE

// ************************************** ERROR HANDLERS *********************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port: ", port)
})
