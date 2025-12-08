#!/bin/bash
set -e

# --- Configuration ---
# Default command
IOS_BUILD_COMMAND="yarn ubrn:ios"

# Check for arguments
for arg in "$@"
do
    if [ "$arg" == "--release" ]; then
        echo "INFO: Release flag detected."
        IOS_BUILD_COMMAND="yarn ubrn:ios-release"
    fi
done
# ---------------------

# Save the current directory to return to it later
ORIGINAL_DIR="$(pwd)"

# Determine the App Directory
# If HARRYS_PASSWORD_MANAGER_APP_DIR is set, use it.
# Otherwise, determine it relative to this script's location.
if [ -z "$HARRYS_PASSWORD_MANAGER_APP_DIR" ]; then
  # Get the directory where this script is located
  SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  
  # Assuming the script is in 'scripts/', the app root is one level up
  HARRYS_PASSWORD_MANAGER_APP_DIR="$SCRIPT_DIR/.."
fi

echo "INFO: Using App Directory: $HARRYS_PASSWORD_MANAGER_APP_DIR"

# Navigate to the App Directory
cd "$HARRYS_PASSWORD_MANAGER_APP_DIR"

# 1. Build the Core Module
echo "INFO: Building harrys-password-manager-core..."
cd modules/harrys-password-manager-core
# Execute the command determined at the start of the script
echo "INFO: Running build command command: $IOS_BUILD_COMMAND"
$IOS_BUILD_COMMAND
yarn prepare

# 2. Return to App Directory
cd "$HARRYS_PASSWORD_MANAGER_APP_DIR"

# 3. Remove the existing node_modules entry
if [ -d "node_modules/react-native-harrys-password-manager-core" ]; then
  echo "INFO: Removing old node_modules/react-native-harrys-password-manager-core..."
  rm -r node_modules/react-native-harrys-password-manager-core
else
  echo "WARNING: node_modules/react-native-harrys-password-manager-core does not exist, skipping removal."
fi

# 4. Reinstall dependencies
echo "INFO: Reinstalling react-native-harrys-password-manager-core..."
pnpm install react-native-harrys-password-manager-core

# Return to the original directory
cd "$ORIGINAL_DIR"
echo "INFO: Finished building react-native-harrys-password-manager-core."
