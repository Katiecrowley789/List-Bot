const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client()

const starterlists = [
  "Add using -add , delete using -del"
]

db.get("lists").then(lists => {
  if (!lists || lists.length < 1) {
    db.set("lists", starterlists)
  }
})

function updatelists(listMessage) {
  db.get("lists").then(lists => {
    lists.push([listMessage])
    db.set("lists", lists)
  })
}

function deleteList(index) {
  db.get("lists").then(lists => {
    if (lists.length > index) {
      lists.splice(index, 1)
      db.set("lists", lists)
    }
  })  
}

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content.startsWith("-add")) {
    listMessage = msg.content.split("-add ")[1]
    updatelists(listMessage)
    msg.channel.send("New to-do added to list.")
  }

  if (msg.content.startsWith("-del")) {
    index = parseInt(msg.content.split("-del ")[1])
    deleteList(index)
    msg.channel.send("To-do deleted.")
  }

  if (msg.content.startsWith("-list")) {
    db.get("lists").then(lists => {
      msg.channel.send("Here is your list:")
      msg.channel.send(lists)
    })
  }
})
keepAlive()
client.login(process.env.TOKEN)