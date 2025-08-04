import { store } from "~/store/shared-store";

export function parseMentionUsers(users: string[]) {
  const _users: string[] = [];
  for (const userId of users) {
    _users.push(`<@${userId}>`);
  }

  store.setState({ userMentions: _users });
}
