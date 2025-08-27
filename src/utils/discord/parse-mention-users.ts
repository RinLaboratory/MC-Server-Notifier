import { discordStore } from "@store";

export function parseMentionUsers(users: string[]) {
  const _users: string[] = [];
  for (const userId of users) {
    _users.push(`<@${userId}>`);
  }

  discordStore.setState({ mentionUsers: _users });
}
