import json
from particle import Particle

# Read names.txt and create a dictionary mapping pdgCode to full_name
names_dict = {}
with open('names.txt', 'r') as names_file:
    for line in names_file:
        parts = line.strip().split(', ')
        pdg_code = int(parts[0])
        full_name = parts[-1].strip('"').strip('",')
        names_dict[pdg_code] = full_name

# Extract particles information
particles_data = []
for particle in Particle.findall():
    print(particle.name)
    particle_info = {
        "pdgCode": particle.pdgid,
        "latex_name": particle.latex_name,
        "name": particle.name,
        # "mass": particle.mass,
        # "charge": particle.charge,
        # "spin": particle.spin,
        # "lifetime": particle.lifetime,
        # "width": particle.width,
        # "isospin": particle.I,
        # "parity": particle.P,
        # "C_parity": particle.C,
        # "G_parity": particle.G,
        # "quark_content": particle.quark_content,
        # "baryon_number": particle.B,
        # "lepton_number": particle.L,
        # "anti_flag": particle.anti_flag,
        # "radius": particle.radius,
        # "ctau": particle.ctau,
        # "J": particle.J,
        # "status": particle.status,
        "full_name": names_dict.get(particle.pdgid, "Unknown")  # Add full_name from names_dict
    }
    particles_data.append(particle_info)

# Save to JSON file
with open('particles.json', 'w') as json_file:
    json.dump(particles_data, json_file, indent=4)

print("Particle data has been saved to particles.json")