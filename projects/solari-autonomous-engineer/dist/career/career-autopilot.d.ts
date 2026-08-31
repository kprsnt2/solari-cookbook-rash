import type { AgentStepEvent } from "../types.js";
export interface CandidateProfile {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    portfolioUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    skills: string[];
    proofPoints: {
        name: string;
        description: string;
        link: string;
    }[];
}
export interface JobTarget {
    id: string;
    title: string;
    company: string;
    applyUrl: string;
    portalType: "greenhouse" | "lever" | "applytojob" | "workday" | "custom";
    fitScore: number;
    matchGrade: "A" | "B+" | "B" | "C";
    summary: string;
    skillGaps: string[];
}
export interface ApplicationResult {
    jobId: string;
    jobTitle: string;
    company: string;
    status: "verified_submitted" | "dry_run_passed" | "needs_human_vnc" | "failed";
    previewUrl?: string;
    screenshotBase64?: string;
    rrwebEventsCount?: number;
    tailoredAnswers: Record<string, string>;
    vncStreamUrl?: string;
    durationMs: number;
    error?: string;
}
export declare const PRASHANTH_PROFILE: CandidateProfile;
export declare const SAMPLE_LIVE_JOB_TARGETS: JobTarget[];
export declare class CareerAutopilot {
    private solariApiKey;
    private profile;
    private onStep?;
    private sandbox;
    private browserQA;
    private desktop;
    constructor(solariApiKey?: string, profile?: CandidateProfile, onStep?: ((event: AgentStepEvent) => void) | undefined);
    private emit;
    /**
     * Runs the full autonomous job matching, resume tailoring, and stealth browser application.
     */
    applyToJob(job: JobTarget, dryRun?: boolean): Promise<ApplicationResult>;
    /**
     * Runs batch application loop across all matching job targets.
     */
    runDailyBatch(targets?: JobTarget[], dryRun?: boolean): Promise<ApplicationResult[]>;
}
//# sourceMappingURL=career-autopilot.d.ts.map