module.exports = {
    apps: [
        {
            name: "frontend",
            cwd: "./client",
            script: "npm",
            args: "run dev",
            interpreter: "cmd.exe",
        },
    ],
};
