# GC Personal Portfolio

A personal portfolio website for Gerrad Chibuye, showcasing infrastructure engineering, full-stack web development, technical projects, and professional achievements.

## Purpose

The portfolio serves as a professional platform for presenting technical capabilities, documenting engineering projects, and connecting with potential employers and freelance clients.

## Features

- Responsive portfolio interface
- Professional profile and technical expertise
- Database-driven project listings and detail pages
- Project images and video demonstrations
- Contact form with PostgreSQL storage
- CV access
- GitHub profile integration
- SEO metadata, sitemap, and robots.txt
- Keyboard navigation and accessibility improvements

## Technology Stack

- **Backend:** Python, Django
- **Database:** PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript
- **Operating System:** Ubuntu Linux
- **Version Control:** Git and GitHub

## Featured Projects

- **SysGuard:** Lightweight Centralized Infrastructure Monitoring and Remote Management Platform.
- **RESILIENT:** High Availability and Load Balancing Infrastructure.
- **Operation Blackout:** Enterprise Campus Network Design and Simulation.
- **Operation Nexus:** Enterprise Network Infrastructure Design and Implementation.

## Lighthouse Results

| Category | Score |
|---|---:|
| Performance | 96 |
| Accessibility | 100 |
| Best Practices | 92 |

Scores reflect a recorded audit and may vary between environments.

## Development Status

This project is actively developed. Features and deployment configuration may evolve.

## Author

**Gerrad Chibuye**

Infrastructure Engineer & Full-Stack Web Developer

[GitHub Profile](https://github.com/GerradChibuye)
## Local Installation

### Prerequisites

- Python 3.12 or later
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/GerradChibuye/gerrad-portfolio.git
cd gerrad-portfolio

### 2. Set up the Python environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and provide your own Django secret key, PostgreSQL credentials, and local development settings.

**Important:** Never commit `.env`. It contains private configuration and credentials.

### 4. Configure PostgreSQL

Create a PostgreSQL database and a dedicated database user. Configure the database name, username, password, host, and port in `.env`.

The database user should own the portfolio database.

### 5. Apply database migrations

```bash
python manage.py migrate
```

### 6. Create an administrator account

```bash
python manage.py createsuperuser
```

Follow the prompts to create your Django administrator account.

### 7. Start the development server

```bash
python manage.py runserver 8001
```

Open the portfolio at:

http://127.0.0.1:8001/

The Django administration interface is available at:

http://127.0.0.1:8001/admin/

## Security Notes

- Keep `.env` and database credentials private.
- Use a new, securely generated Django secret key.
- Set `DEBUG=False` in production.
- Configure production `ALLOWED_HOSTS` and HTTPS before deployment.
- Do not commit database files, uploaded media, virtual environments, or private backups.

## License

No open-source license has been specified yet. All rights remain with the author unless otherwise stated.
