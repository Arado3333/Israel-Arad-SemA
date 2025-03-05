export class Resume
{
    fullName;
    currentRole;
    skills;
    education;
    teamExperience;
    achievements;
    careerGoals;
    hobbies;
    location;

    constructor(fullName, currentRole, skills, education, teamExperience, achievements, careerGoals, hobbies, location)
    {
        this.fullName = fullName;
        this.currentRole = currentRole;
        this.skills = skills;
        this.education = education;
        this.teamExperience = teamExperience;
        this.achievements = achievements;
        this.careerGoals = careerGoals;
        this.hobbies = hobbies;
        this.location = location;
    }
}
