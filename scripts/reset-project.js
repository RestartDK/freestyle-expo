#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves src/app, src/components, src/hooks, src/constants, and scripts
 * to /app-example based on user input and creates a new src/app directory with index.tsx and _layout.tsx.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
/** Paths relative to project root; each becomes app-example/<destName> when archived. */
const oldDirs = [
  { src: "src/app", destName: "app" },
  { src: "src/components", destName: "components" },
  { src: "src/hooks", destName: "hooks" },
  { src: "src/constants", destName: "constants" },
  { src: "scripts", destName: "scripts" },
];
const exampleDir = "app-example";
const newAppDir = path.join("src", "app");
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    for (const { src, destName } of oldDirs) {
      const oldDirPath = path.join(root, src);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(exampleDirPath, destName);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${src} moved to /${exampleDir}/${destName}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${src} deleted.`);
        }
      } else {
        console.log(`➡️ /${src} does not exist, skipping.`);
      }
    }

    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log(`\n📁 New /${newAppDir} directory created.`);

    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log(`📄 ${newAppDir}/index.tsx created.`);

    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log(`📄 ${newAppDir}/_layout.tsx created.`);

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit ${newAppDir}/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
