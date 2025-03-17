export const TEMPLATE = {
  WELCOME: {
    subject: `Welcome to AirCarer!`,
    body: `
      <h1>Hi <%= name%>, Welcome to our AirCarer!</h1>
    `
  },
  RESET_PASSWORD: {
    subject: `Reset your password`,
    body: `
      <h1>Hi <%= name%>, Reset your password here: <%= link %></h1>
    `
  },
  NEW_TASKS_AVAILABLE: {
    subject: `New tasks available`,
    body: `
      <h1>Hi <%= name%>, New tasks are available. Check it out!</h1>
    `
  }
} as any