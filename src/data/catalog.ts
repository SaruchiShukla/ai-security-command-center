export type Side = 'build' | 'access'

export type ProductId =
  | 'airs'
  | 'ai-access'
  | 'prisma-browser'
  | 'xdr'
  | 'aspm'
  | 'ai-spm'

export type NodeId =
  | 'code'
  | 'data'
  | 'models'
  | 'skills'
  | 'apps'
  | 'runtime'
  | 'users'
  | 'browser'
  | 'genai'
  | 'copilots'

export type Product = {
  id: ProductId
  short: string
  name: string
  family: string
  sideFocus: Side | 'both'
  summary: string
  covers: NodeId[]
  bullets: string[]
  source: { label: string; href: string }
}

export type Threat = {
  id: string
  name: string
  side: Side
  nodeIds: NodeId[]
  productIds: ProductId[]
  severity: 'critical' | 'high' | 'medium'
  description: string
  mitigation: string
}

export type GraphNode = {
  id: NodeId
  label: string
  kicker: string
  side: Side | 'core'
  x: number
  y: number
}

export const products: Product[] = [
  {
    id: 'aspm',
    short: 'ASPM',
    name: 'Application Security Posture Management',
    family: 'Cortex Cloud',
    sideFocus: 'build',
    summary:
      'Unifies native and third-party AppSec findings across code, cloud, and runtime so teams can block issues before they reach production.',
    covers: ['code', 'apps'],
    bullets: [
      'Correlate SCA, IaC, secrets, and third-party scanner noise with business context',
      'Enforce SDLC guardrails that distinguish new vs. existing risk',
      'Close coverage gaps across IDE, VCS, and CI/CD scanning',
    ],
    source: {
      label: 'Cortex Cloud ASPM',
      href: 'https://www.paloaltonetworks.com/cortex/cloud/application-security-posture-management',
    },
  },
  {
    id: 'ai-spm',
    short: 'AI-SPM',
    name: 'AI Security Posture Management',
    family: 'Cortex Cloud',
    sideFocus: 'build',
    summary:
      'Discovers models, datasets, agents, and AI software packages, then scores supply-chain, poisoning, and over-permissioned access paths.',
    covers: ['data', 'models', 'skills', 'apps'],
    bullets: [
      'Inventory managed and shadow models, training data, and agent infrastructure',
      'Map NIST AI RMF-aligned risks: poisoning, unsanctioned models, exposed tools',
      'Shift-left on AI packages (LangChain, LLM SDKs) and known CVEs in the supply chain',
    ],
    source: {
      label: 'Cortex Cloud AI-SPM',
      href: 'https://www.paloaltonetworks.com/cortex/cloud/ai-security-posture-management',
    },
  },
  {
    id: 'airs',
    short: 'Prisma AIRS',
    name: 'Prisma AIRS · AI Runtime Security',
    family: 'Prisma AIRS',
    sideFocus: 'both',
    summary:
      'Inspects live prompts, responses, MCP, and agent-to-agent traffic to stop prompt injection, data leaks, malicious URLs, and unsafe agent actions.',
    covers: ['apps', 'runtime', 'skills', 'models', 'copilots'],
    bullets: [
      'Network Intercept and API Intercept for apps, models, data, and agents',
      'AI Gateway as the control plane for identity, policy, and audit of AI traffic',
      'Model security, red teaming, and supply-chain scans for models and agent skills',
    ],
    source: {
      label: 'Prisma AIRS',
      href: 'https://www.paloaltonetworks.com/ai-security/prisma-airs',
    },
  },
  {
    id: 'ai-access',
    short: 'AI Access',
    name: 'AI Access Security',
    family: 'Prisma Access / SASE',
    sideFocus: 'access',
    summary:
      'Governs employee use of public GenAI: discover apps, apply DLP on prompts, and inspect model responses for malware and malicious URLs.',
    covers: ['users', 'genai', 'browser'],
    bullets: [
      'Discover and tag sanctioned vs. shadow GenAI applications',
      'Enterprise DLP on prompts and attachments before they leave the enterprise',
      'Fine-grained allow, coach, or block policies without blanket bans',
    ],
    source: {
      label: 'AI Access Security',
      href: 'https://www.paloaltonetworks.com/sase/ai-access-security',
    },
  },
  {
    id: 'prisma-browser',
    short: 'Prisma Browser',
    name: 'Prisma Browser',
    family: 'Prisma SASE',
    sideFocus: 'access',
    summary:
      'Enterprise browser (plus extension and mobile) that stops evasive web and AI-powered threats, governs AI in the workspace, and protects sensitive data.',
    covers: ['browser', 'users', 'genai', 'copilots'],
    bullets: [
      'Advanced WildFire, live page scanning, and malicious-extension control',
      'Native enterprise DLP and identity controls in the workspace',
      'Secure any user, app, location, or device — including unmanaged endpoints',
    ],
    source: {
      label: 'Prisma Browser',
      href: 'https://www.paloaltonetworks.com/sase/prisma-browser',
    },
  },
  {
    id: 'xdr',
    short: 'Agent / Endpoint',
    name: 'Cortex XDR · Agentic Endpoint Security',
    family: 'Cortex',
    sideFocus: 'both',
    summary:
      'One agent for NGAV, behavioral prevention, and agentic endpoint security: discover AI agents, coding tools, MCP servers, IDE extensions, and risky packages.',
    covers: ['users', 'skills', 'copilots', 'code'],
    bullets: [
      'Behavioral Threat Protection against fileless malware, exploits, and ransomware',
      'Agentic Endpoint Security discovers non-binary AI attack surface on the host',
      'Correlates endpoint, network, cloud, identity, and email for multi-vector attacks',
    ],
    source: {
      label: 'Cortex endpoint protection',
      href: 'https://www.paloaltonetworks.com/cortex/endpoint-protection',
    },
  },
]

export const nodes: GraphNode[] = [
  { id: 'code', label: 'Code & CI/CD', kicker: 'Build', side: 'build', x: 118, y: 92 },
  { id: 'data', label: 'Training / RAG data', kicker: 'Build', side: 'build', x: 118, y: 236 },
  { id: 'models', label: 'Models & registries', kicker: 'Build', side: 'build', x: 118, y: 380 },
  { id: 'skills', label: 'Skills, MCP, tools', kicker: 'Build', side: 'build', x: 118, y: 524 },
  { id: 'apps', label: 'AI applications', kicker: 'Core', side: 'core', x: 500, y: 164 },
  { id: 'runtime', label: 'Live inference', kicker: 'Core', side: 'core', x: 500, y: 420 },
  { id: 'users', label: 'Workforce & devices', kicker: 'Access', side: 'access', x: 882, y: 92 },
  { id: 'browser', label: 'Enterprise browser', kicker: 'Access', side: 'access', x: 882, y: 236 },
  { id: 'genai', label: 'Public GenAI apps', kicker: 'Access', side: 'access', x: 882, y: 380 },
  { id: 'copilots', label: 'Copilots & agents', kicker: 'Access', side: 'access', x: 882, y: 524 },
]

export const edges: [NodeId, NodeId][] = [
  ['code', 'apps'],
  ['data', 'models'],
  ['models', 'apps'],
  ['skills', 'runtime'],
  ['apps', 'runtime'],
  ['users', 'browser'],
  ['browser', 'genai'],
  ['browser', 'copilots'],
  ['genai', 'runtime'],
  ['copilots', 'runtime'],
  ['code', 'skills'],
]

export const threats: Threat[] = [
  {
    id: 'secrets-in-repo',
    name: 'Secrets in source and pipelines',
    side: 'build',
    nodeIds: ['code'],
    productIds: ['aspm', 'xdr'],
    severity: 'critical',
    description:
      'API keys, model credentials, and cloud tokens committed to git or leaked in CI logs become a direct path into model endpoints and training stores.',
    mitigation:
      'ASPM secrets scanning and CI guardrails block the merge. Cortex XDR flags credential-stealer behavior if an endpoint is already compromised.',
  },
  {
    id: 'poisoned-deps',
    name: 'Poisoned AI software supply chain',
    side: 'build',
    nodeIds: ['code', 'skills'],
    productIds: ['aspm', 'ai-spm', 'xdr'],
    severity: 'high',
    description:
      'Malicious npm/pip packages, LLM SDKs, or LangChain plugins introduce backdoors into agents before they ever reach production.',
    mitigation:
      'ASPM SCA plus AI-SPM package inventory highlight CVEs and unpopular AI libraries. Agentic Endpoint Security discovers the same packages on developer machines.',
  },
  {
    id: 'data-poison',
    name: 'Training / RAG data poisoning',
    side: 'build',
    nodeIds: ['data', 'models'],
    productIds: ['ai-spm', 'airs'],
    severity: 'critical',
    description:
      'Attackers seed biased, toxic, or backdoored records into datasets and vector stores so the model later obeys hidden instructions.',
    mitigation:
      'AI-SPM classifies sensitive and untrusted training sources. Prisma AIRS model security and red teaming validate artifacts before promotion.',
  },
  {
    id: 'shadow-model',
    name: 'Shadow / unsanctioned models',
    side: 'build',
    nodeIds: ['models', 'apps'],
    productIds: ['ai-spm', 'airs'],
    severity: 'high',
    description:
      'Teams deploy unmanaged endpoints or pull weights from untrusted registries, expanding attack surface with no inventory or policy.',
    mitigation:
      'AI-SPM discovers managed and unmanaged models and attack paths. Prisma AIRS AI Gateway only allows approved models, identities, and budgets.',
  },
  {
    id: 'malicious-skill',
    name: 'Malicious agent skill / MCP tool',
    side: 'build',
    nodeIds: ['skills', 'runtime'],
    productIds: ['airs', 'ai-spm', 'xdr'],
    severity: 'critical',
    description:
      'Agent skills can hide prompt manipulation, shell commands, secret access, or unsafe MCP usage that executes with the agent’s privileges.',
    mitigation:
      'Prisma AIRS AI Skill Security scans artifacts. AI-SPM inventories agent infrastructure. Cortex Agentic Endpoint Security remediates risky MCP servers on the host.',
  },
  {
    id: 'insecure-iac',
    name: 'Over-permissioned AI cloud paths',
    side: 'build',
    nodeIds: ['models', 'apps', 'data'],
    productIds: ['aspm', 'ai-spm'],
    severity: 'high',
    description:
      'Misconfigured IAM, public buckets of embeddings, or overly broad model endpoints let attackers steal weights or exfiltrate training data.',
    mitigation:
      'ASPM IaC policy plus AI-SPM attack-path analysis show which identities can reach sensitive model and data resources.',
  },
  {
    id: 'prompt-injection',
    name: 'Prompt injection & jailbreaks',
    side: 'access',
    nodeIds: ['runtime', 'apps', 'copilots'],
    productIds: ['airs', 'ai-access'],
    severity: 'critical',
    description:
      'Direct and indirect prompt injection tries to override system intent, leak context, or coerce agents into unsafe tool calls.',
    mitigation:
      'Prisma AIRS inspects prompts, MCP, and A2A inline. AI Access Security evaluates employee prompts to public GenAI for the same class of abuse.',
  },
  {
    id: 'dlp-prompt',
    name: 'Sensitive data in prompts',
    side: 'access',
    nodeIds: ['genai', 'browser', 'users'],
    productIds: ['ai-access', 'prisma-browser', 'airs'],
    severity: 'critical',
    description:
      'Source code, PII, and credentials pasted into ChatGPT-class apps become training data or tenant leakage outside enterprise control.',
    mitigation:
      'AI Access Security and Prisma Browser apply Enterprise DLP on prompts and uploads. Prisma AIRS blocks sensitive data leaving custom AI apps.',
  },
  {
    id: 'malicious-response',
    name: 'Malicious URLs & malware in responses',
    side: 'access',
    nodeIds: ['genai', 'runtime', 'browser'],
    productIds: ['ai-access', 'airs', 'prisma-browser'],
    severity: 'high',
    description:
      'Model output can carry phishing URLs, toxic content, or payloads that a user or agent then executes.',
    mitigation:
      'Precision AI services in AI Access, Prisma AIRS, and Prisma Browser inspect responses and live pages before content executes.',
  },
  {
    id: 'shadow-ai',
    name: 'Shadow AI & unsanctioned SaaS',
    side: 'access',
    nodeIds: ['users', 'browser', 'genai'],
    productIds: ['ai-access', 'prisma-browser'],
    severity: 'medium',
    description:
      'Employees route work through unknown copilots and consumer browsers, creating visibility gaps and policy bypass.',
    mitigation:
      'AI Access Security discovers GenAI apps; Prisma Browser (and its extension) tracks risky web apps and can coach or block them.',
  },
  {
    id: 'phishing-ai',
    name: 'AI-powered phishing in the browser',
    side: 'access',
    nodeIds: ['browser', 'users'],
    productIds: ['prisma-browser', 'xdr'],
    severity: 'high',
    description:
      'Evasive, AI-generated spear phishing and malicious extensions target the browser as the new workspace.',
    mitigation:
      'Prisma Browser uses live page scanning, WildFire, and extension security. Cortex XDR contains the endpoint if the payload still lands.',
  },
  {
    id: 'agent-misuse',
    name: 'Agent memory & tool misuse',
    side: 'access',
    nodeIds: ['copilots', 'runtime', 'skills'],
    productIds: ['airs', 'xdr', 'ai-spm'],
    severity: 'critical',
    description:
      'Autonomous agents with standing credentials can be steered into data exfil, destructive tool use, or privilege escalation.',
    mitigation:
      'Prisma AIRS Agent Security plus AI Gateway least-privilege identities. Cortex XDR AES and AI-SPM constrain what is installed and reachable.',
  },
]

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<
  ProductId,
  Product
>
export const threatById = Object.fromEntries(threats.map((t) => [t.id, t])) as Record<string, Threat>
export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<NodeId, GraphNode>

export function threatsForNode(id: NodeId) {
  return threats.filter((t) => t.nodeIds.includes(id))
}

export function threatsForProduct(id: ProductId) {
  return threats.filter((t) => t.productIds.includes(id))
}
