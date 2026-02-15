export declare const init: Init;
export declare const registerEvents: ["OnStartLevel", "OnTimerActive", "OnPhysicsUpdate", "OnPlayerDeadEnd", "OnPostSwitchBallEnd", "OnPreSwitchBallStart", "OnReceiveCustomEvent", "OnPostTransferBallEnd", "OnPreTransferBallStart", "OnPostCheckpointReached", "OnPostDestinationReached"];
export declare const onEvents: OnEvents<typeof registerEvents>;
