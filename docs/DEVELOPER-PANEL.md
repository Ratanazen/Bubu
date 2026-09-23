# Developer App Panel

BUBU includes a fully integrated, lightweight development environment optimized for old and low-resource computers.

## Features
- **Project Detection:** Automatically identifies C, C++, Rust, Node.js, Python, Java, and Go projects by analyzing configuration files (`CMakeLists.txt`, `Cargo.toml`, `package.json`, etc.).
- **Toolchain Diagnostics:** Live detection of local compilers and runtimes (`gcc`, `clang`, `rustc`, `node`, `python3`).
- **Build & Run Engine:** Securely execute builds directly from the Developer Panel interface via native child process spawning.
- **Low-End Mode Constraints:** Bubu limits background IPC queries and restricts recursive file polling when running the developer panel on constrained hardware to maintain UI fluidity.

## Security Architecture
The developer panel executes local shell commands. To protect the environment:
1. Operations are strictly routed through `@bubu/developer-engine` on the Node.js backend.
2. The renderer only issues abstract `runProcess` intents; it never generates arbitrary shell scripts.
3. IPC schema validation ensures paths are contained within recognized workspace roots.

## Future Roadmap
- Integrated PTY terminal emulator via `xterm.js`.
- Local Git GUI management (Diff, Commit, Push).
- Advanced debugging adapters (GDB / LLDB / Node Inspector).
