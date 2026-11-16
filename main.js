/**
 * Anand S Kumar — Game Developer, 3D Animation & Realtime VFX Artist Portfolio
 * Systems:
 * - Dynamic Golden Mesh Canvas with Rounder & Thicker Nodes
 * - Background Golden Vector Aesthetics (Light Theme with Red Highlights)
 * - Procedural Web Audio API Synthesizer (Zero external dependencies)
 * - Project Filter System & Interactive Architecture & Art Inspector Modal
 * - Interactive Sci-Fi Dev Console (Command Terminal)
 * - Navigation & Smooth UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initGoldenMeshCanvas();
  initProjectFilters();
  initProjectModal();
  initDevTerminal();
  initContactForm();
  initNav();
});

/* ==========================================================================
   1. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */

let audioCtx = null;
let sfxEnabled = false;

function initAudioSystem() {
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxText = sfxToggleBtn ? sfxToggleBtn.querySelector('.sfx-text') : null;
  const iconOff = sfxToggleBtn ? sfxToggleBtn.querySelector('.sfx-icon--off') : null;
  const iconOn = sfxToggleBtn ? sfxToggleBtn.querySelector('.sfx-icon--on') : null;
  const audioStatus = document.getElementById('audioStatus');

  if (!sfxToggleBtn) return;

  sfxToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    sfxEnabled = !sfxEnabled;
    sfxToggleBtn.classList.toggle('is-active', sfxEnabled);
    sfxToggleBtn.setAttribute('aria-pressed', String(sfxEnabled));

    if (sfxText) sfxText.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    if (iconOff) iconOff.style.display = sfxEnabled ? 'none' : 'block';
    if (iconOn) iconOn.style.display = sfxEnabled ? 'block' : 'none';
    if (audioStatus) audioStatus.textContent = sfxEnabled ? 'Audio enabled' : 'Audio disabled';

    if (sfxEnabled) {
      playUiBeep(720, 0.08, 'sine');
    }
  });

  // Attach subtle UI sound to buttons & links
  document.querySelectorAll('.btn, .filter-btn, .term-chip, .nav__link').forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      if (sfxEnabled) playUiBeep(880, 0.03, 'sine', 0.04);
    });
    elem.addEventListener('click', () => {
      if (sfxEnabled) playUiBeep(440, 0.06, 'triangle', 0.06);
    });
  });
}

function playUiBeep(freq, duration, type = 'sine', volume = 0.08) {
  if (!sfxEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback
  }
}

/* ==========================================================================
   2. DYNAMIC GOLDEN MESH BACKGROUND CANVAS
   ========================================================================== */

function initGoldenMeshCanvas() {
  const canvas = document.getElementById('goldenMeshCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let points = [];
  const pointCount = 38;
  const maxDistance = 180;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create points
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.2
    });
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw golden nodes
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw point
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(197, 155, 39, 0.45)';
      ctx.fill();

      // Connect with nearby points with golden lines
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.strokeStyle = `rgba(197, 155, 39, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect to mouse if close
      const mouseDx = p.x - mouse.x;
      const mouseDy = p.y - mouse.y;
      const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      if (mouseDist < 160) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        const mouseAlpha = (1 - mouseDist / 160) * 0.35;
        ctx.strokeStyle = `rgba(229, 37, 42, ${mouseAlpha})`; // Red interactive line on hover
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ==========================================================================
   3. PROJECT FILTERS
   ========================================================================== */

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. PROJECT TECHNICAL BREAKDOWN MODAL
   ========================================================================== */

const projectSpecsDatabase = {
  'squishy': {
    title: 'Squishy: Precision 2D Kinematics & Jump Physics',
    badge: 'UNITY • C# • PHYSICS2D • ITCH.IO',
    summary: 'A cute yet maddeningly difficult precision vertical platformer created and published by AnandFrameWorks on Itch.io. Features sub-pixel collision checks, responsive jump buffering, and zero checkpoints—testing raw player timing on every leap.',
    features: [
      'Dynamic jump buffering and coyote time allowing frame-forgiving leaps off ledge edges',
      'Procedural squash and stretch deformations responding dynamically to velocity on landing',
      'Deterministic 2D kinematic gravity scaling for authoritative, satisfying jump arcs',
      'Browser-playable HTML5 / WebGL export optimized for itch.io hosting'
    ],
    codeTitle: 'Squishy_PlayerKinematics.cs',
    code: `// Precision Jump Buffering & Dynamic Squash/Stretch Kinematics
public class SquishyController : MonoBehaviour {
    [SerializeField] private float jumpForce = 14f;
    [SerializeField] private float coyoteTime = 0.12f;
    [SerializeField] private float jumpBufferTime = 0.1f;
    
    private float coyoteCounter;
    private float bufferCounter;
    private Rigidbody2D rb;

    void Update() {
        // Update Coyote & Jump Buffer Windows
        coyoteCounter = isGrounded ? coyoteTime : coyoteCounter - Time.deltaTime;
        if (Input.GetButtonDown("Jump")) bufferCounter = jumpBufferTime;
        else bufferCounter -= Time.deltaTime;

        // Authoritative Jump Execution with Squash/Stretch trigger
        if (bufferCounter > 0f && coyoteCounter > 0f) {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            TriggerSquashStretch(0.7f, 1.35f); // Stretch on launch
            bufferCounter = 0f;
            coyoteCounter = 0f;
        }
    }
}`
  },
  'road-block': {
    title: 'Road Block: Unity AI Agents & Dynamic NavMesh',
    badge: 'UNITY • C# • NAVMESH • ITCH.IO',
    summary: 'A browser-based testbed on Itch.io exploring Unity AI agents and NavMesh pathfinding. Autonomous agents dynamically navigate around roadblock barricades, evaluating paths and avoiding congestion in real-time.',
    features: [
      'Dynamic NavMesh surface baking accommodating moving obstacles and traffic hazards',
      'Agent obstacle avoidance using multi-raycast sensory feelers and steering behaviors',
      'Traffic flow arbitration preventing multi-agent deadlocks at chokepoints',
      'Playable testbed deployed via WebGL on anandframeworks.itch.io'
    ],
    codeTitle: 'RoadBlock_NavAgentController.cs',
    code: `// Autonomous Agent Steering & Dynamic Obstacle Recalculation
public class RoadBlockAIAgent : MonoBehaviour {
    private NavMeshAgent agent;
    [SerializeField] private Transform destinationTarget;

    void Start() {
        agent = GetComponent<NavMeshAgent>();
        agent.avoidancePriority = Random.Range(10, 90);
        RecalculatePath();
    }

    public void OnRoadblockPlaced(Vector3 hazardPosition) {
        // Check if current path intersects road obstruction
        if (agent.hasPath && IsPathObstructed(agent.path, hazardPosition)) {
            agent.ResetPath();
            RecalculatePath();
        }
    }
}`
  },
  'framework-studios': {
    title: 'Framework Studios: 3D Animation & Rigging Showcase',
    badge: 'AUTODESK MAYA • BLENDER • MARVELOUS DESIGNER',
    summary: 'Curated 3D character rigs, keyframed acting, and cloth simulations featured on my official art studio account (@frameworkstudios.official). Demonstrates end-to-end technical animation skills.',
    features: [
      'Custom full-body bipedal and creature armature skeletons with IK/FK switching',
      'Marvelous Designer pattern tailoring and dynamic cloth simulation baking',
      'Dope sheet and graph editor curve smoothing for natural, weighty locomotion',
      'Curated production posts and reels shared on Instagram @frameworkstudios.official'
    ],
    codeTitle: 'FrameworkStudios_MayaRigNode.py',
    code: `# Maya Python API: Automated Limb IK/FK Limb Constraint Setup
import maya.cmds as cmds

def create_ik_fk_arm(shoulder_jnt, elbow_jnt, wrist_jnt, prefix="Arm_L"):
    # Generate IK handle with RP Solver
    ik_handle = cmds.ikHandle(sj=shoulder_jnt, ee=wrist_jnt, sol='ikRPsolver', n=f"{prefix}_IKHandle")[0]
    # Connect pole vector constraint for elbow orientation
    pole_ctrl = cmds.spaceLocator(n=f"{prefix}_PoleVector_Ctrl")[0]
    cmds.poleVectorConstraint(pole_ctrl, ik_handle)
    cmds.setAttr(f"{ik_handle}.visibility", 1)
    return ik_handle, pole_ctrl`
  },
  'framework-models': {
    title: 'Framework Studios: 3D Hard-Surface & Props',
    badge: 'BLENDER • MAYA • SUBSTANCE PAINTER',
    summary: 'Hard-surface game assets, robotic mecha armor, and weapon models from @frameworkstudios.official. Built with clean sub-d topology in Blender/Maya and procedural PBR wear in Substance Painter.',
    features: [
      'Clean game-ready low-poly topology with high-poly bake normals and curvature maps',
      'Multi-layer weathered metal, painted surfaces, and grime accumulation in Substance Painter',
      'UDIM workflow organization and custom decal alphas designed in Photoshop',
      'Production art feed shared on Instagram @frameworkstudios.official'
    ],
    codeTitle: 'PBR_MetallicRoughness_Setup.hlsl',
    code: `// Universal PBR Material Shader Snippet (Cook-Torrance Specular BRDF)
float3 EvaluatePBR(float3 N, float3 V, float3 L, float3 albedo, float metallic, float roughness) {
    float3 H = normalize(V + L);
    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);
    
    // Normal Distribution (GGX), Fresnel (Schlick), and Geometric Shadowing (Smith)
    float D = DistributionGGX(N, H, roughness);
    float G = GeometrySmith(N, V, L, roughness);
    float3 F0 = lerp(float3(0.04, 0.04, 0.04), albedo, metallic);
    float3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);
    
    float3 numerator = D * G * F;
    float denominator = 4.0 * NdotV * NdotL + 0.0001;
    return (numerator / denominator) * NdotL;
}`
  },
  'neon-requiem': {
    title: 'Neon Requiem: Combat Animation & Unreal 5 Mechanics',
    badge: 'UNREAL ENGINE 5.4 • MAYA • C++',
    summary: 'A fast-paced cyberpunk melee title combining high-octane katana gameplay with hand-keyed Maya attack animations and frame-accurate parry collisions in Unreal Engine 5.',
    features: [
      'Sub-frame weapon collision sweeping using custom PhysX/Chaos tracing',
      'Directional katana slash animations with Maya combat skeletons and IK constraints',
      'Hierarchical time-dilation manager (matrix slowdown on perfect counter)',
      'Responsive hitstop freezeframes and camera trauma triggers on impact'
    ],
    codeTitle: 'NeonRequiem_ParryAbility.cpp',
    code: `// Frame-accurate Parry Window calculation with Time Dilation
void UGA_KatanaParry::ActivateAbility(...) {
    UAbilitySystemComponent* ASC = GetAbilitySystemComponentFromActorInfo();
    if (!ASC) return;

    // Apply active parry state tag (6 frame invulnerability window)
    FGameplayEffectSpecHandle SpecHandle = MakeOutgoingGameplayEffectSpec(ParryEffectClass);
    FActiveGameplayEffectHandle ActiveGE = ASC->ApplyGameplayEffectSpecToSelf(*SpecHandle.Data);

    // Bind combat tracer for directional collision check
    UCombatHitboxComponent* Tracer = GetAvatarActorFromActorInfo()->FindComponentByClass<UCombatHitboxComponent>();
    Tracer->OnHitDetected.AddDynamic(this, &UGA_KatanaParry::OnCounterSuccess);
}`
  },
  'ashfall': {
    title: 'Ashfall: Dynamic Marvelous Cloth & Dark Fantasy Combat',
    badge: 'MARVELOUS DESIGNER • MAYA • UE5',
    summary: 'A stamina-based dark fantasy combat system featuring poise breaks, telegraph recognition, root motion animation warping, and complex multi-phase boss choreography.',
    features: [
      'Realistic multi-layer fabric garments patterned in Marvelous Designer and optimized for games',
      'Handcrafted Maya boss attack animations with readable telegraph anticipation frames',
      'Poise regeneration decay curves and hyper-armor damage thresholding in Unreal Engine 5',
      'Substance Painter oxidized bronze and decayed iron PBR texture sets'
    ],
    codeTitle: 'Ashfall_PoiseSystem.cpp',
    code: `// Poise damage calculation with hyper-armor state reduction
void UPoiseComponent::TakePoiseDamage(float RawPoiseDamage, bool bIsHyperArmor) {
    float EffectiveDamage = bIsHyperArmor ? RawPoiseDamage * 0.35f : RawPoiseDamage;
    CurrentPoise = FMath::Max(0.0f, CurrentPoise - EffectiveDamage);

    if (CurrentPoise <= 0.0f) {
        TriggerStaggerBreak(); // Grants visceral critical strike window
    } else {
        GetWorld()->GetTimerManager().SetTimer(PoiseRegenTimer, this, &UPoiseComponent::StartRegen, 3.5f);
    }
}`
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const backdrop = document.getElementById('modalBackdrop');

  if (!modal) return;

  function openModal(projectId) {
    const data = projectSpecsDatabase[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;

    modalBody.innerHTML = `
      <p style="font-size: 15px; color: var(--text-main); line-height: 1.6;">${data.summary}</p>

      <div>
        <h4 style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--gold-primary); margin-bottom: 12px;">KEY TECHNICAL & ART SYSTEMS</h4>
        <div class="modal-feature-list">
          ${data.features.map(f => `<div class="modal-feature-item"><span>${f}</span></div>`).join('')}
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--red-primary);">${data.codeTitle}</h4>
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--gold-primary);">GAMEPLAY & VFX CODE</span>
        </div>
        <pre class="modal-code-snippet"><code>${escapeHtml(data.code)}</code></pre>
      </div>
    `;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   5. INTERACTIVE SCI-FI DEV CONSOLE (COMMAND TERMINAL)
   ========================================================================== */

function initDevTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const chips = document.querySelectorAll('.term-chip');

  if (!terminalForm || !terminalInput || !terminalOutput) return;

  const commands = {
    help: () => `
Available commands:
  <span class="term-highlight">help</span>       - Displays available terminal commands
  <span class="term-highlight">projects</span>   - Lists Squishy, Road Block, and 3D animation showcases
  <span class="term-highlight">skills</span>     - Outputs Unity C#, Unreal, 3D animation & VFX toolkit
  <span class="term-highlight">stats</span>      - Returns age (22), shipped titles & creative metrics
  <span class="term-highlight">hire</span>       - Prints role availability, contracts & direct email
  <span class="term-highlight">whoami</span>     - Displays Anand S Kumar's developer & artist biography
  <span class="term-highlight">clear</span>      - Clears current terminal buffer`,

    projects: () => `
Featured Created Games & Projects:
  [01] <span class="term-line--accent">Kuvalamkaattu Ilam</span> (First-Person Horror • Unreal Engine 5 • In Development)
  [02] <span class="term-line--accent">Squishy</span>            (Precision Vertical Platformer • Unity C# • Itch.io)
  [03] <span class="term-line--accent">Road Block</span>         (Unity AI Agents & NavMesh Testbed • Itch.io)`,

    skills: () => `
Core Technical & Artistic Toolkit:
  • Game Engines:   Unreal Engine (Blueprints, C++, Lumen, Nanite, MetaSounds), Unity (C# Gameplay, Physics2D, NavMesh)
  • 3D Animation:   Blender, Autodesk Maya (Character Rigging & Keyframing)
  • Cloth & Sim:    Marvelous Designer (Dynamic pattern tailoring & garment draping)
  • 3D Texturing:   Substance 3D Painter (AAA PBR Materials & Normal Baking), Photoshop
  • VFX & Video:    Adobe After Effects (Compositing, VFX, Motion Graphics), Adobe Premiere Pro`,

    stats: () => `
Production & Creative Telemetry:
  • Age:                  22 Years Old
  • Studio:               Framework Studio
  • Current:              M.Sc. Game Technology (Backstage Pass)
  • Film Credits:         3D Generalist @ Flyfish Studio — 'Rekhachithram' & 'Emerald' (2025)
  • Degree:               B.Sc. Animation & VFX (Westford Institute of Film Technology - WIFT)
  • Projects:             Kuvalamkaattu Ilam (UE5 In Dev), Squishy (Itch.io), Road Block (Itch.io)
  • Direct Email:         anandskumarndd@gmail.com`,

    hire: () => `
Role Availability & Contract Engagements:
  • Status:     <span class="term-line--accent">OPEN FOR OFFERS (Full-Time Studio Roles & Senior Contracts)</span>
  • Roles:      Game Developer / 3D Animator / VFX Artist
  • Portfolios: https://anandframeworks.itch.io | https://www.instagram.com/frameworkstudios.official
  • Contact:    anandskumarndd@gmail.com`,

    whoami: () => `
Anand S Kumar (22) — Game Developer, 3D Animator & VFX Artist.
• M.Sc. Game Technology student at Backstage Pass.
• Worked full-time as 3D Generalist at Flyfish Studio during 6th semester on 2 movies: Rekhachithram & Emerald (2025).
• B.Sc. Animation & VFX from Westford Institute of Film Technology (WIFT).
• Creator of Squishy & Road Block on itch.io.
Proficient in Unity (C#), Blender, Maya, Marvelous Designer, Substance Painter, After Effects, and Premiere Pro.`,

    clear: () => {
      terminalOutput.innerHTML = '';
      return null;
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append user query
    const queryLine = document.createElement('div');
    queryLine.className = 'term-line term-line--accent';
    queryLine.innerHTML = `guest@anand-dev:~$ ${escapeHtml(rawCmd)}`;
    terminalOutput.appendChild(queryLine);

    // Execute
    if (commands[cmd]) {
      const output = commands[cmd]();
      if (output) {
        const outLine = document.createElement('div');
        outLine.className = 'term-line term-line--out';
        outLine.innerHTML = output;
        terminalOutput.appendChild(outLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-line';
      errLine.style.color = 'var(--red-primary)';
      errLine.innerHTML = `Command not recognized: '${escapeHtml(cmd)}'. Type <span class="term-highlight">help</span> for commands.`;
      terminalOutput.appendChild(errLine);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.value = '';
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(terminalInput.value);
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM TRANSMISSION SIMULATION
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.userName.value.trim();
    const email = form.userEmail.value.trim();
    const message = form.userMessage.value.trim();

    if (!name || !email || !message) {
      feedback.className = 'form-feedback is-error';
      feedback.textContent = 'ERROR: Please complete all required transmission parameters (Name, Email, Brief).';
      return;
    }

    // Simulate Transmission Sequence
    btnText.textContent = 'ENCRYPTING PAYLOAD...';
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = 'Transmitting packet over secure channel [TLS 1.3]...';

    setTimeout(() => {
      btnText.textContent = 'TRANSMISSION CONFIRMED';
      feedback.className = 'form-feedback is-success';
      feedback.textContent = `SUCCESS: Transmission acknowledged by Anand S Kumar. A dispatch will be routed to ${email} shortly.`;
      form.reset();

      setTimeout(() => {
        btnText.textContent = 'TRANSMIT MESSAGE';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   7. NAVIGATION & SMOOTH SCROLLING
   ========================================================================== */

function initNav() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('header');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}
