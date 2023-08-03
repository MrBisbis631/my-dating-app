export const clientDashboardUrl = "/client"
export const matchMakerDashboardUrl = "/matchmaker"
export const adminDashboardUrl = "/admin"

export const ClientSpace: Map<string, string> = new Map([
  ["dashboard", clientDashboardUrl],
  ["profile", "/client/profile"],
  ["settings", "/client/settings"],
  ["matches", "/client/matches"],
  ["matchmaker", "/client/matchmaker"],
  ["logout", "/logout"], 
])

export const MatchMakerSpace: Map<string, string> = new Map([
  ["dashboard", matchMakerDashboardUrl],
  ["profile", "/matchmaker/profile"],
  ["settings", "/matchmaker/settings"],
  ["clients", "/matchmaker/clients"],
  ["logout", "/logout"], 
])

export const AdminSpace: Map<string, string> = new Map([ 
  ["dashboard", adminDashboardUrl],
  ["profile", "/admin/profile"],
  ["settings", "/admin/settings"],
  ["clients", "/admin/clients"],
  ["matchmakers", "/admin/matchmakers"],
  ["logout", "/logout"], 
])
