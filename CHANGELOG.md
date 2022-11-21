# Changelog
All notable changes to this add-on will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2021-12-12
### Added
- Disable the bot in support group #1 and support group #2.
- Ability to blacklist certain people / chats from using the bot in public mode.
- Generate invite link to invite people who cannot be added directly.
- Rename and resend file directly on WhatsApp.
- Create groups with the tagged person directly.
- Execute C++ code and get output directly on WhatsApp.
- Search for meaning in the dictionary for a word.
- Create QR code from text.
- Decode QR code to extract text.

### Changed
- Removed case sensitivity issue for WORK_TYPE.
- The getdp module can now get profile pictures of a tagged person as well.
- Improved the lyrics search module.
- Make the permission check asynchronous.
- Switch back to stable version of baileys.

## [1.0.1] - 2021-11-15
### Added
- Pull latest changes from the repo before starting the bot.
- Automatically install new packages, if any, in case of new updates.

### Changed
- Elevate tagall command to admin only.
- Mention the license in readme.
- Improve command detection regex to avoid triggering just prefix as a command.
- Fix minor typos.
- Private / Public acknowledgement message only sent once in each group.
- Fix the bug where bot wasn't working in new groups.

## [1.0.0] - 2021-11-07
### Added
- Initial Release

[Unreleased]: https://github.com/Prince-Mendiratta/BotsApp/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Prince-Mendiratta/BotsApp/releases/tag/v1.1.0
[1.0.1]: https://github.com/Prince-Mendiratta/BotsApp/releases/tag/v1.0.1
[1.0.0]: https://github.com/Prince-Mendiratta/BotsApp/releases/tag/v1.0.0