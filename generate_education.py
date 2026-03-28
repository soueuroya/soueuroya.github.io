import json

education_items = [
    {
        "title": "Game Programming - Advanced Diploma",
        "institution": "George Brown College",
        "date": "Graduated April 2021",
        "location": "Toronto, ON - Canada",
        "description": "Graduated with honours. Studied networking, console programming, mobile development, 3D animation, and design. Mastered Unity3D, Unreal Engine, OpenGL, C#, C++, and Python.",
        "type": "Education",
        "icon": "fa-graduation-cap"
    },
    {
        "title": "System Analysis and Development - Diploma",
        "institution": "Federal Institute of São Paulo (IFSP)",
        "date": "Graduated January 2017",
        "location": "Araraquara, SP - Brazil",
        "description": "Studied C, C++, C#, Java, Lua, and Python. Specialized in networking, security, OS, and database management. Volunteered as a tutor in Object Oriented Programming and Data Structures.",
        "type": "Education",
        "icon": "fa-graduation-cap"
    },
    {
        "title": "Web Accessibility - Undergraduate Research",
        "institution": "IFSP",
        "date": "Presented 2012",
        "location": "Brazil (Various cities)",
        "description": "Researched human-computer interaction and accessibility implications for users with disabilities. Developed a specialized survey targeting governmental systems based on W3C affordance best practices.",
        "type": "Research",
        "icon": "fa-microscope"
    },
    {
        "title": "Biz Game Development Presenter",
        "institution": "SESC Araraquara",
        "date": "Presented November 2013",
        "location": "Araraquara, SP - Brazil",
        "description": "Volunteered as a Business and Game Development presenter. Created and demoed 3 minigames targeting different genres using C# and XNA.",
        "type": "Presentation",
        "icon": "fa-chalkboard-teacher"
    },
    {
        "title": "Standards of Business Conduct Certification",
        "institution": "Hewlett Packard",
        "date": "Completed July 2015",
        "location": "Araraquara, SP - Brazil",
        "description": "Corporate certification covering ethical and professional standards in enterprise environments.",
        "type": "Certification",
        "icon": "fa-certificate"
    },
    {
        "title": "Secret Acting Role (Volunteer)",
        "institution": "Hand Eye Society",
        "date": "Volunteered August 2018",
        "location": "Toronto, ON - Canada",
        "description": "Volunteered as an undercover agent acting role. Facilitated guest interaction for the main alternate reality game played during the Hand Eye Society Ball.",
        "type": "Volunteer Work",
        "icon": "fa-hands-helping"
    }
]

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daniel Boldrin | Education & Certifications</title>
    
    <!-- Unified CSS -->
    <link rel="stylesheet" href="css/main.css?v=2">
    
    <!-- FontAwesome for icons -->
    <script defer src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"></script>
</head>
<body>

    <!-- Sticky Navigation -->
    <nav class="navbar">
        <div class="navbar-container">
            <a href="index.html" class="logo">Daniel <span class="highlight">Boldrin</span></a>
            <ul class="nav-links">
                <li><a href="index.html" class="nav-link"><i class="fas fa-arrow-left"></i> Back to Home</a></li>
            </ul>
        </div>
    </nav>

    <div style="height: 100px;"></div> <!-- Spacer for fixed nav -->

    <!-- EDUCATION SECTION -->
    <section class="section" id="education">
        <div class="container">
            <h2 class="fade-up">Full Background</h2>
            <p class="fade-up" style="margin-bottom: 3rem; color: #94a3b8;">Degrees, research, certifications, and volunteer work.</p>
            
            <div class="timeline">
{TIMELINE_ITEMS}
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="social-links fade-up">
                <a href="mailto:daniel_cboldrin@hotmail.com" class="social-link" title="Email me" aria-label="Email"><i class="fas fa-envelope"></i></a>
                <a href="https://www.linkedin.com/in/daniel-boldrin/" target="_blank" class="social-link" title="LinkedIn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://github.com/soueuroya" target="_blank" class="social-link" title="GitHub" aria-label="GitHub"><i class="fab fa-github"></i></a>
                <a href="https://danielboldrin.itch.io/" target="_blank" class="social-link" title="Itch.io" aria-label="Itch.io"><i class="fab fa-itch-io"></i></a>
            </div>
            <p class="copyright fade-up delay-1">&copy; 2026 Daniel Boldrin. Built with Unity, C#, and a passion for interactive systems.</p>
        </div>
    </footer>

    <!-- unified script -->
    <script src="js/main.js?v=2"></script>
</body>
</html>"""

timeline_html = ""
for item in education_items:
    timeline_html += f'''
                <div class="timeline-item fade-up">
                    <div class="timeline-header">
                        <div>
                            <h3 class="timeline-role"><i class="fas {item['icon']}" style="margin-right: 10px; color: var(--accent);"></i>{item['title']}</h3>
                            <span class="timeline-company">{item['institution']} - {item['location']}</span>
                        </div>
                        <span class="timeline-date">{item['date']}</span>
                    </div>
                    <div class="timeline-content">
                        <p>{item['description']}</p>
                        <div class="tags">
                            <span class="tag">{item['type']}</span>
                        </div>
                    </div>
                </div>'''

final_html = html_template.replace("{TIMELINE_ITEMS}", timeline_html)

with open("education.html", "w", encoding="utf-8") as f:
    f.write(final_html)
    
print("education.html successfully built!")
