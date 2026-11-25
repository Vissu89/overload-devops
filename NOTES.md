# Engineering Log

| Date | Phase | Issue / Task | Root cause | Fix | Learning |
|------|-------|--------------|------------|-----|----------|
| 2026-11-19 | 1 | Node/npm missing in WSL | Fresh distro | Installed via nvm (LTS) | nvm gives current versions without sudo |
| 2026-11-19 | 1 | Empty folders not on GitHub | Git doesn't track empty dirs | Added .gitkeep files | Git tracks files, not directories |
| 2026-11-19 | 2 | `docker` not found in WSL | Docker Desktop WSL integration off for Ubuntu | Enabled integration, restarted WSL | CLI and daemon are separate; CLI needs the daemon socket |
| 2026-11-19 | 2 | Second container: "port is already allocated" | Host port 8080 already bound | Mapped to host port 8081 | Container ports are isolated; host ports are shared |
| 2026-11-19 | 2 | Container Exited (1) | Missing `;` after `listen 80` in nginx.conf (found via `docker logs`) | Fixed config; added `RUN nginx -t` to Dockerfile | Validate config at build time (shift-left) |
| 2026-11-19 | 2 | Bind mount: "mount a directory onto a file" | Source file missing, Docker auto-created a directory | Recreated file in a persistent path | Docker creates missing bind-mount sources as directories |
| 2026-11-19 | 2 | Stray shell commands inside Dockerfile | Heredoc not closed with EOF | Rewrote file, verified with `cat -n` | Always verify generated files before committing |
| 2026-11-20 | 2 | Health check on wrong path `/healthz` still reported healthy | SPA fallback (`try_files ... /index.html`) returns 200 for any path; `wget --spider` only checks status | Health check now verifies body = `ok` | False-positive health checks: check content, not just status code |
| 2026-11-20 | 2 | Container unhealthy (streak 6) while app returned 200 | Health check pointed at non-existent path | Diagnosed by testing app directly with curl | In K8s, a bad liveness probe kills healthy pods → CrashLoopBackOff |
| 2026-11-20 | 2 | Old container still running old image after rebuild | Containers keep the image they started with | Recreated container | Rebuilding an image doesn't update running containers (K8s needs a rollout) |
| 2026-11-23 | 3 | Drift: VPC name tag changed + HotFix tag added in console | Manual change outside Terraform | 'terraform plan' detected it | reverted with terraform apply | Code is source of truth: revert or adopt the drift; detect with scheduled 'plan -detailed-exitcode' |
| 2026-11-23 | 3 | `terraform validate`: "Variables not allowed" in terraform.tfvars | File had literal `${MYIP}` (heredoc was quoted) | Regenerated with real IP | `<<'EOF'` keeps `$` literal; `<<EOF` expands variables |
| 2026-11-23 | 3 | SSH "Permission denied (publickey)" | Ran ssh from PowerShell; key lives in WSL `~/.ssh` | Ran from WSL | Windows and WSL have separate home dirs; check which key is offered (`ssh -v`) |
| 2026-11-24 | 3 | State only on laptop (single point of failure, no locking) | Local backend | Bootstrapped S3 bucket (versioned, encrypted, public access blocked, prevent_destroy); migrated with `init -migrate-state` | Remote state + native S3 locking (`use_lockfile`, TF >= 1.10) |
| 2026-11-24 | 3 | Second `plan` blocked: "Error acquiring the state lock" (412) | Lock held by a running apply | Waited / released; stale locks → verify nothing running, then `force-unlock <ID>` | Never use `-lock=false` |
| 2026-11-25 | 4 | Ansible: "No inventory was parsed" | Config named `ansible-cfg` instead of `ansible.cfg` | Renamed | `ansible --version` shows which config is loaded; `-i` bypasses it |
| 2026-11-25 | 4 | SSH hardening must override cloud-init defaults | sshd uses the FIRST value it reads in `sshd_config.d/` | Named file `00-hardening.conf`; verified with `sshd -T` | Verify effective config, not just "ok" |
| 2026-11-25 | 4 | Thought server rebooted during playbook | It was the SSH handler restarting sshd; 'uptime -s' showed boot time = instance creation | Verified with 'uptime -s' and the reboot task's "skipping" | verify with evidence; handlers run at end of play |
