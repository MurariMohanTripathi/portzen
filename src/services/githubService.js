export async function fetchGitHubProfile(username) {
  const clean = String(username || "").trim();
  if (!clean) return null;

  const [profileResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`),
    fetch(`https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=updated&per_page=6`),
  ]);

  if (!profileResponse.ok) throw new Error("GitHub profile not found.");

  const profile = await profileResponse.json();
  const repos = reposResponse.ok ? await reposResponse.json() : [];
  const stars = repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);

  return {
    username: clean,
    followers: profile.followers || 0,
    publicRepos: profile.public_repos || 0,
    avatarUrl: profile.avatar_url || "",
    profileUrl: profile.html_url || `https://github.com/${clean}`,
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      stars: repo.stargazers_count || 0,
      language: repo.language || "",
    })),
    stars,
  };
}
