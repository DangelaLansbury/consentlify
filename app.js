const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { type } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// PLACEHOLDER FORM
let formTitle = "Informed Consent Form";
let partOneTitle = "Part I. Information Sheet";
let studyURL = "https://en.wikipedia.org/wiki/Melange_(fictional_drug)"
let sectionsRaw = [
    { 
        header: "Whom is this form for?",
        body: "This form is for any current Omnius Scourge patients invited to participate in research on the effectiveness of a new treatment. We want you to understand {your rights}[We'll get into this more in a bit, but it's worth emphasizing these rights at the top here: you have the right to ask any questions of me and my staff, to any information we have regarding your disease and the treatment we'll be giving you, to refuse treatment or withdraw from the trial at any time, and to the data related to the results of your treatment.] as a participant in this or any trial, the goal of our research, and your potential risks and benefits as a patient."
    },
    { 
        header: "Introduction",
        body: "My name is Dr. Zhineyar, PhD. I am working with the Hospital for Incurable Diseases here in Niubbe to conduct research on a new treatment's potential to improve health, fortify the immune system, and  prolong life in patients afflicted with the Omnius Scourge. Before you decide to participate, I encourage you to talk to me or {anyone you feel comfortable with}[It will be critically important for you to have a support network in the months ahead. My staff and I will share a list of community groups who will welcome you and the names of any other organizations who can help.] about the research."
    },
    {
        header: "The Purpose of The Research",
        body: "The Omnius Scourge is one of the most common and dangerous diseases in this region, and the drugs currently used to help people with the Scourge are not as good as we would like them to be. Early research suggests Melange may be a more effective {intervention}[I'll be using this term a lot; it's just another way of saying the drug we're using to interfere with or disrupt the effects of the disease, or the treatment you'll be receiving.] against the Scourge. The reason we're conducting this trial is to find out if Melange does in fact lead to better treatment outcomes."
    },
    {
        header: "Type of Research Intervention",
        body: "This research will involve {four twelve-minute intervals of exposure}[More detail on this in a bit.] to Melange as well as three follow-up visits to the clinic."
    },
    {
        header: "Participant Selection",
        body: "We are inviting all adults with malaria who attend The Hospital for Incurable Diseases to participate in the research on Melange."
    },
    {
        header: "Voluntary Participation",
        body: "Your participation in this research is entirely voluntary. {It is your choice whether to participate or not.}[And whether you choose to participate or not, all the services you receive at this clinic will continue and nothing will change.] If you choose not to participate in this research project, you will be offered the treatment that is routinely offered in this clinic/hospital for Omnius Scourge. You may also change your mind later and stop participating, even if you had agreed to participate earlier."
    },
    {
        header: "Information on Melange",
        body: "The drug we are testing in this research is called Melange. It has been tested before with people who do not have Omnius Scourge but who live in areas where the Scourge is common. We now want to {test the drug on people who do have the disease.}[This kind of research is called a Phase 2 trial.] You should know that Melange has a few side effects, which we'll cover in more detail in a moment. It also has several {potential benefits}[These include a generally fortified immune system and longer life expectancy. In some cases, life expectancy for those exposed to Melange has tripled. There have also been observed cases of enhanced sensory perception and powerful abilities that include {the prescience.}[Commonly described as the ability to see into the past, present and future.]] beyond its possible use as a cure for the Scourge."
    },
    {
        header: "Procedures and Protocol",
        body: "Because we don't know if Melange is better than the currently available drug for treating the Scourge, we need to compare the two. To do this, we will put people taking part in this research into two groups. The groups are selected by chance, as if by tossing a coin. Participants in one group will be given the test drug while participants in the other group will be given the {treatment regimen}[There is no risk associated with that regimen and no known problems. It does not, however, cure the Scourge.] most commonly used to treat the Scourge. It is important that neither you nor we know which of the two drugs you are given. {This information will be in our files, but we will not look at these files until after the research is finished.}[This is the best way we have for testing without being influenced by what we think or hope might happen.] We will then compare which of the two has the best results. We will be looking after you and the other participants very carefully throughout the study. If we are concerned about what the drug is doing, we will find out which drug you are getting and make changes. If there is anything you are concerned about or that is bothering you about the research {please talk to me or one of the other researchers.}[That's what we're here for.]"
    },
    {
        header: "Description of Process",
        body: "During the research you'll make eight total visits to the clinic. In the first visit, a {small amount of blood,}[This blood will be tested for the presence of substances that help your body to fight infections.] equal to about a teaspoon, will be taken from your arm with a syringe. We will also ask you a few questions about your general health and measure how tall you are and how much you weigh. At the {next visit,}[Which will be one week later.] you will again be asked some questions about your health, and then you will be given either Melange or the drug currently used for the Scourge. These treatments will continue every two weeks until you've received four doses. You will then come back to the clinic once a week for three more weeks to have your blood tested and your condition evaluated."
    },
    {
        header: "Duration",
        body: "The research takes place over three months in total. During that time, it will be necessary for you to {come to the clinic 8 days , for about 1-2 hours each day.}[We'll be providing some financial assistance to cover travel to and from the hospital, but if transportation, lodging, or any other expenses and/or logistical obstacles associated with participating in the trial are a concern for you, please speak to me and my staff. We'll connect you with individuals or organizations who are able to help.] We would like to meet with you three months after your last clinic visit for a final check-up. After that that the research will be finished."
    },
    {
        header: "Side Effects",
        body: "As I mentioned before, this drug can have some unwanted effects. The most noticeable at first will be the {Eyes of the Ibad.}[The whites of your eyes may take on a rich blue hue.] Beyond such physical alterations, the spice has narcotic properties associated with addiction after prolonged use. However, we will follow you closely and keep track of any unwanted effects or any problems. We may use some other medicines to decrease the symptoms of the side effects or reactions. Or we may stop the use of one or more drugs. If this is necessary we will discuss it together with you and you will always be consulted before we move to the next step."
    },
    {
        header: "Risks",
        body: "By participating in this research it is possible that you will be at greater risk than you would otherwise be. There is, for example, a risk that your disease will not get better and that the {new medicine doesn't work even as well as the old one.}[While the likelihood of this happening is very low, you should still be aware of its possibility.]"
    },
    {
        header: "Benefits",
        body: "If you participate in this research, you will have the following benefits: any interim illnesses will be treated at no charge to you. If your child falls sick during this period he/she will be treated free of charge. It is also important to remember that while it's possible there may not be any benefit for you, your participation will help us find the answer to curing the Scourge."
    },
    {
        header: "Reimbursements",
        body: "We will give you money to pay for your travel to the clinic/parking and we will give you an {appropriate sum}[Our staff will work with you to calculate missed wages and benefits.] for lost work time. You will not be given any other money or gifts to take part in this research."
    },
    {
        header: "Confidentiality",
        body: "The information that we collect from this research project will be kept confidential. Information about you that will be collected during the research will be put away and {no-one but the researchers will be able to see it.}[Any information about you will have a number on it instead of your name. Only the researchers will know what your number is and we will lock that information up with a lock and key. It will not be shared with or given to anyone except my immediate staff and me.]"
    },
    {
        header: "Sharing the Results",
        body: "The knowledge that we get from doing this research will be shared with you through {community meetings}[Confidential information will not be shared.] before it is made widely available to the public. There will be small meetings in the community and we will announce the schedule for those as we approach the trial. After these meetings, we will publish the results in order that other interested people may learn from our research."
    },
    {
        header: "Right to Refuse or Withdraw",
        body: "You do not have to take part in this research if you do not wish to do so and refusing to participate will not affect your treatment at this clinic in any way. You will still have all the benefits that you would otherwise have at this clinic. You may stop participating in the research at any time that you wish without losing any of your rights as a patient here. Your treatment at this clinic will not be affected in any way."
    },
    {
        header: "Alternatives to Participating",
        body: "If you do not wish to take part in the research, you will be provided with the established standard treatment available at the hospital."
    },
    {
        header: "Who to Contact",
        body: "If you have any questions you may ask them now or later, even after the study has started. If you wish to ask questions later, you may {contact me}[My info will be on the contact sheet in your onboarding packet, but here's my number again in case you need to speak with me immediately for any reason whatsoever: 555-555-5555] or my staff directly. I will give you an additional form with all of our contact information."
    }
];
let partOneDisclaimer = "This proposal has been reviewed and approved by the Parmentier Medical Review Board, which is a committee whose task it is to make sure that research participants are protected from harm. If you wish to find out more about the PMRB, visit their website. It has also been reviewed by the Ethics Review Committee of the Landsraad Health Organization (LHO), which is sponsoring the study.";
let partTwoTitle = "Part II. Ceritificate of Consent";
let consentDescription = "I have read the information on this page, or it has been read to me. I have had the opportunity to ask questions about it and any questions that I have asked have been answered to my satisfaction. I consent voluntarily to participate as a participant in this research.";
let sections = [];

// Form Viewer
app.get("/", function(req, res){
    sections = [];
    let annotationCount = 0;
    // Add annotations
    for (let index = 0; index < sectionsRaw.length; index++) {
        let bodyText = sectionsRaw[index].body;
        for (let i = 0; i < bodyText.length; i++){
            bodyText = bodyText.replace("{", "<a id='" + annotationCount + "' class='annotation annotation-link'>");
            bodyText = bodyText.replace("}", "</a>");
            bodyText = bodyText.replace("[", "<span id='annotation" + annotationCount + "' class='annotation annotation-body' style='display: none'>");
            bodyText = bodyText.replace("]", "</span>");
            annotationCount++;
        }
        const section = {
            header: sectionsRaw[index].header,
            body: bodyText,
        }
        sections.push(section);
    }
    res.render("home", {
        title: formTitle, 
        studyLink: studyURL, 
        partOneName: partOneTitle, 
        allSections: sections, 
        disclaimer: partOneDisclaimer, 
        partTwoName: partTwoTitle,
        consentPatient: consentDescription
    });
});

// Form Editor 
app.get("/edit", function(req, res){
    res.render("edit", {
        title: formTitle, 
        studyLink: studyURL, 
        partOneName: partOneTitle, 
        allSections: sectionsRaw, 
        disclaimer: partOneDisclaimer, 
        partTwoName: partTwoTitle,
        consentPatient: consentDescription
    });
});

// Edited form
app.post("/edit", function(req,res){
    sectionsRaw = [];
    sections = [];
    // Title
    formTitle = req.body.formTitle;
    // Link to study
    studyURL = req.body.studyURL;
    // Form sections
    const about = {
        header: req.body.aboutTitle,
        body: req.body.aboutBody
    }
    const intro = {
        header: req.body.introTitle,
        body: req.body.introBody
    }
    const purposeResearch = {
        header: req.body.purposeResearchTitle,
        body: req.body.purposeResearchBody
    }
    const typeOfResearch = {
        header: req.body.typeOfResearchTitle,
        body: req.body.typeOfResearchBody
    }
    const selection = {
        header: req.body.selectionTitle,
        body: req.body.selectionBody
    }
    const voluntPart = {
        header: req.body.voluntPartTitle,
        body: req.body.voluntPartBody
    }
    const infoOnDrug = {
        header: req.body.infoOnDrugTitle,
        body: req.body.infoOnDrugBody
    }
    const protocol = {
        header: req.body.protocolTitle,
        body: req.body.protocolBody
    }
    const descOfProcess = {
        header: req.body.descOfProcessTitle,
        body: req.body.descOfProcessBody
    }
    const duration = {
        header: req.body.durationTitle,
        body: req.body.durationBody
    }
    const sideEffects = {
        header: req.body.sideEffectsTitle,
        body: req.body.sideEffectsBody
    }
    const risks = {
        header: req.body.risksTitle,
        body: req.body.risksBody
    }
    const benefits = {
        header: req.body.benefitsTitle,
        body: req.body.benefitsBody
    }
    const reimbursements = {
        header: req.body.reimbursementsTitle,
        body: req.body.reimbursementsBody
    }
    const confidentiality = {
        header: req.body.confidentialityTitle,
        body: req.body.confidentialityBody
    }
    const sharing = {
        header: req.body.sharingTitle,
        body: req.body.sharingBody
    }
    const rightToRefuse = {
        header: req.body.rightToRefuseTitle,
        body: req.body.rightToRefuseBody
    }
    const alts = {
        header: req.body.altsTitle,
        body: req.body.altsBody
    }
    const contact = {
        header: req.body.contactTitle,
        body: req.body.contactBody
    }
    sectionsRaw.push(about, intro, purposeResearch, typeOfResearch, selection, voluntPart, infoOnDrug, protocol, descOfProcess, duration, sideEffects, risks, benefits, reimbursements, confidentiality, sharing, rightToRefuse, alts, contact);
    // Consent Language for Participant
    consentDescription = req.body.consentDescription;
    // Reload Viewer with Edits
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});
