import type { Finding } from "@/types";

export const mockFindings: Finding[] = [
  {
    id: "finding-dup-ip-core",
    title: "Duplicate IP address on routed interfaces",
    severity: "critical",
    category: "IP Addressing",
    deviceId: "core-rtr-01",
    device: "CORE-RTR-01",
    vendor: "Cisco IOS",
    location: {
      section: "interface GigabitEthernet0/2",
      lineStart: 18,
      lineEnd: 19,
      interfaceName: "GigabitEthernet0/2",
    },
    relevantValue: "10.10.10.1/24",
    evidence: {
      summary:
        "GigabitEthernet0/1 and GigabitEthernet0/2 are configured with the same IPv4 address and mask.",
      references: [
        { label: "Existing interface", value: "GigabitEthernet0/1 10.10.10.1/24", line: 14 },
        { label: "Conflicting interface", value: "GigabitEthernet0/2 10.10.10.1/24", line: 19 },
      ],
    },
    description:
      "Two routed interfaces on the same device are assigned an identical IPv4 address.",
    whyItMatters:
      "Duplicate Layer 3 addresses can break adjacency formation, cause ARP instability, and make forwarding behavior unpredictable.",
    impact:
      "Traffic for the internal distribution segment may blackhole or oscillate during deployment.",
    aiExplanation:
      "The deterministic rule flagged an exact duplicate address. The explanation layer identifies this as a deployment blocker because the router cannot reliably distinguish the two connected networks.",
    recommendation:
      "Assign GigabitEthernet0/2 a unique address from the intended secondary distribution subnet before deployment.",
    confidence: 0.99,
    detectionSources: ["Rule Engine", "Semantic Analysis"],
    remediation: {
      summary: "Use a unique subnet on the secondary distribution link.",
      currentConfig: [
        "interface GigabitEthernet0/2",
        " description Secondary distribution link",
        " ip address 10.10.10.1 255.255.255.0",
        " no shutdown",
      ],
      proposedConfig: [
        "interface GigabitEthernet0/2",
        " description Secondary distribution link",
        " ip address 10.10.20.1 255.255.255.0",
        " no shutdown",
      ],
      diff: [
        " interface GigabitEthernet0/2",
        "  description Secondary distribution link",
        "- ip address 10.10.10.1 255.255.255.0",
        "+ ip address 10.10.20.1 255.255.255.0",
        "  no shutdown",
      ],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        {
          name: "Syntax validation",
          status: "passed",
          detail: "Cisco IOS interface address syntax is valid.",
        },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Proposed address no longer duplicates another local interface.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No overlap detected with configured connected routes in this mock dataset.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Requires engineer confirmation of the intended subnet plan.",
        },
      ],
    },
    relatedConfigId: "cfg-cisco-core",
  },
  {
    id: "finding-acl-any-core",
    title: "Overly broad permit rule in edge ACL",
    severity: "high",
    category: "Security / ACL",
    deviceId: "core-rtr-01",
    device: "CORE-RTR-01",
    vendor: "Cisco IOS",
    location: {
      section: "access-list 110",
      lineStart: 28,
      ruleName: "access-list 110",
    },
    relevantValue: "permit ip any any",
    evidence: {
      summary: "ACL 110 permits all IPv4 traffic from any source to any destination.",
      references: [{ label: "ACL entry", value: "access-list 110 permit ip any any", line: 28 }],
    },
    description:
      "A broad access control entry permits unrestricted traffic and may bypass intended segmentation.",
    whyItMatters:
      "Pre-deployment ACL review should verify that permissive rules are narrowed to approved source, destination, and service scopes.",
    impact:
      "Unwanted lateral movement or policy bypass could be introduced if this configuration is deployed unchanged.",
    aiExplanation:
      "The rule engine detected a high-risk wildcard ACL. The AI explanation layer recommends validating whether this line is a temporary test rule or an intentional exception.",
    recommendation:
      "Replace the broad permit with least-privilege source, destination, and service definitions.",
    confidence: 0.96,
    detectionSources: ["Rule Engine", "Static Analysis"],
    remediation: {
      summary: "Constrain the ACL to approved management and application networks.",
      currentConfig: ["access-list 110 permit ip any any"],
      proposedConfig: [
        "access-list 110 permit tcp 10.10.10.0 0.0.0.255 10.50.10.0 0.0.0.255 eq 443",
        "access-list 110 deny ip any any log",
      ],
      diff: [
        "- access-list 110 permit ip any any",
        "+ access-list 110 permit tcp 10.10.10.0 0.0.0.255 10.50.10.0 0.0.0.255 eq 443",
        "+ access-list 110 deny ip any any log",
      ],
      riskLevel: "medium",
      approvalRequired: true,
    },
    validation: {
      status: "warning",
      checks: [
        {
          name: "Syntax validation",
          status: "passed",
          detail: "Replacement ACL entries use valid Cisco IOS syntax.",
        },
        {
          name: "Semantic validation",
          status: "warning",
          detail: "Business-approved source and service scope must be confirmed.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No duplicate ACL sequence conflict in the prototype config.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Policy restriction can interrupt traffic if scope is incomplete.",
        },
      ],
    },
    relatedConfigId: "cfg-cisco-core",
  },
  {
    id: "finding-vlan-access",
    title: "Access VLAN is not defined on switch",
    severity: "medium",
    category: "VLAN",
    deviceId: "sw-access-01",
    device: "SW-ACCESS-01",
    vendor: "Cisco IOS",
    location: {
      section: "interface GigabitEthernet1/0/1",
      lineStart: 13,
      interfaceName: "GigabitEthernet1/0/1",
    },
    relevantValue: "switchport access vlan 30",
    evidence: {
      summary: "The access port references VLAN 30, but only VLANs 10 and 20 are defined.",
      references: [
        { label: "Configured VLANs", value: "10, 20", line: 5 },
        { label: "Referenced VLAN", value: "30", line: 13 },
      ],
    },
    description: "A switchport references a VLAN that is absent from the local VLAN database.",
    whyItMatters:
      "Missing VLAN definitions can place endpoints into an inactive VLAN, breaking access for connected clients.",
    impact:
      "The Floor-2 endpoint could lose connectivity after deployment.",
    aiExplanation:
      "Static analysis detected a local reference mismatch. The recommended action depends on whether VLAN 30 should exist or the port should use an existing VLAN.",
    recommendation:
      "Confirm the intended access VLAN, then either create VLAN 30 or assign the port to VLAN 10 or 20.",
    confidence: 0.92,
    detectionSources: ["Static Analysis"],
    remediation: {
      summary: "Create VLAN 30 if it is the approved Floor-2 segment.",
      currentConfig: [
        "interface GigabitEthernet1/0/1",
        " switchport access vlan 30",
      ],
      proposedConfig: [
        "vlan 30",
        " name FLOOR_2_USERS",
        "interface GigabitEthernet1/0/1",
        " switchport access vlan 30",
      ],
      diff: [
        "+ vlan 30",
        "+  name FLOOR_2_USERS",
        " interface GigabitEthernet1/0/1",
        "  switchport access vlan 30",
      ],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        { name: "Syntax validation", status: "passed", detail: "VLAN stanza is syntactically valid." },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Referenced VLAN exists after the proposed change.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No existing VLAN ID collision detected.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Requires confirmation that VLAN 30 is expected on upstream trunks.",
        },
      ],
    },
    relatedConfigId: "cfg-cisco-access",
  },
  {
    id: "finding-telnet-access",
    title: "Telnet enabled on management lines",
    severity: "high",
    category: "Management",
    deviceId: "sw-access-01",
    device: "SW-ACCESS-01",
    vendor: "Cisco IOS",
    location: {
      section: "line vty 0 4",
      lineStart: 23,
      ruleName: "line vty 0 4",
    },
    relevantValue: "transport input telnet ssh",
    evidence: {
      summary: "VTY access allows Telnet alongside SSH.",
      references: [{ label: "VTY transport", value: "transport input telnet ssh", line: 23 }],
    },
    description: "Remote management accepts Telnet, which sends credentials in clear text.",
    whyItMatters:
      "Management-plane controls should avoid insecure protocols before a configuration is approved for deployment.",
    impact:
      "Administrative credentials could be exposed on trusted but shared management networks.",
    aiExplanation:
      "The static rule identifies an insecure management protocol. The explanation layer frames this as a management-plane hardening issue rather than a routing failure.",
    recommendation: "Restrict VTY transport to SSH only.",
    confidence: 0.98,
    detectionSources: ["Rule Engine", "Static Analysis"],
    remediation: {
      summary: "Remove Telnet from accepted VTY transports.",
      currentConfig: ["line vty 0 4", " transport input telnet ssh"],
      proposedConfig: ["line vty 0 4", " transport input ssh"],
      diff: [" line vty 0 4", "- transport input telnet ssh", "+ transport input ssh"],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        { name: "Syntax validation", status: "passed", detail: "VTY transport syntax is valid." },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "SSH remains enabled for management access.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No dependent Telnet-only management policy found in mock data.",
        },
        {
          name: "Risk assessment",
          status: "passed",
          detail: "Low implementation risk when SSH reachability is confirmed.",
        },
      ],
    },
    relatedConfigId: "cfg-cisco-access",
  },
  {
    id: "finding-overlap-juniper",
    title: "Overlapping connected subnets",
    severity: "high",
    category: "IP Addressing",
    deviceId: "edge-rtr-01",
    device: "EDGE-RTR-01",
    vendor: "Juniper",
    location: {
      section: "interfaces ge-0/0/1 and ge-0/0/2",
      lineStart: 15,
      lineEnd: 19,
      interfaceName: "ge-0/0/2",
    },
    relevantValue: "172.16.12.0/24 overlaps 172.16.12.128/25",
    evidence: {
      summary: "A /25 backup WAN segment is contained inside the /24 WAN handoff segment.",
      references: [
        { label: "WAN handoff", value: "172.16.12.1/24", line: 15 },
        { label: "Backup WAN", value: "172.16.12.129/25", line: 19 },
      ],
    },
    description: "Two Junos interfaces use overlapping connected IPv4 prefixes.",
    whyItMatters:
      "Overlapping connected routes can lead to ambiguous forwarding and unexpected route selection.",
    impact:
      "Backup WAN traffic may be forwarded over the wrong interface or fail during failover testing.",
    aiExplanation:
      "The rule engine found a deterministic prefix overlap. ML anomaly context marks this as unusual compared with the organization's normal WAN handoff pattern.",
    recommendation:
      "Move the backup WAN interface to a non-overlapping subnet or correct the prefix lengths.",
    confidence: 0.95,
    detectionSources: ["Rule Engine", "ML Anomaly Detection"],
    remediation: {
      summary: "Correct the backup WAN prefix to the approved /30 handoff.",
      currentConfig: ["unit 0 { family inet { address 172.16.12.129/25; } }"],
      proposedConfig: ["unit 0 { family inet { address 172.16.13.2/30; } }"],
      diff: [
        "- unit 0 { family inet { address 172.16.12.129/25; } }",
        "+ unit 0 { family inet { address 172.16.13.2/30; } }",
      ],
      riskLevel: "medium",
      approvalRequired: true,
    },
    validation: {
      status: "warning",
      checks: [
        { name: "Syntax validation", status: "passed", detail: "Junos address syntax is valid." },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Proposed subnet no longer overlaps the WAN handoff.",
        },
        {
          name: "Conflict check",
          status: "warning",
          detail: "Next-hop reachability must be confirmed for the backup provider.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "WAN addressing changes require a maintenance window.",
        },
      ],
    },
    relatedConfigId: "cfg-juniper-edge",
  },
  {
    id: "finding-invalid-nexthop",
    title: "Static route next-hop is unreachable",
    severity: "medium",
    category: "Routing",
    deviceId: "edge-rtr-01",
    device: "EDGE-RTR-01",
    vendor: "Juniper",
    location: {
      section: "routing-options static",
      lineStart: 25,
      ruleName: "route 10.20.0.0/16",
    },
    relevantValue: "next-hop 172.16.13.254",
    evidence: {
      summary:
        "The configured next-hop does not belong to any connected interface subnet in the parsed configuration.",
      references: [
        { label: "Static route", value: "10.20.0.0/16 next-hop 172.16.13.254", line: 25 },
        { label: "Connected networks", value: "198.51.100.0/30, 172.16.12.0/24, 172.16.12.128/25" },
      ],
    },
    description: "A static route references a next-hop outside the known connected networks.",
    whyItMatters:
      "A next-hop that is not reachable at Layer 3 will not reliably install or forward traffic as intended.",
    impact: "Routes toward the 10.20.0.0/16 network may be inactive after deployment.",
    aiExplanation:
      "Semantic analysis flagged reachability rather than syntax. The line is valid Junos syntax, but it conflicts with the parsed interface topology.",
    recommendation:
      "Correct the next-hop to an address reachable through the intended WAN or add the missing connected interface configuration.",
    confidence: 0.88,
    detectionSources: ["Semantic Analysis"],
    remediation: {
      summary: "Align the route next-hop with the corrected backup WAN segment.",
      currentConfig: ["route 10.20.0.0/16 next-hop 172.16.13.254;"],
      proposedConfig: ["route 10.20.0.0/16 next-hop 172.16.13.1;"],
      diff: [
        "- route 10.20.0.0/16 next-hop 172.16.13.254;",
        "+ route 10.20.0.0/16 next-hop 172.16.13.1;",
      ],
      riskLevel: "medium",
      approvalRequired: true,
    },
    validation: {
      status: "warning",
      checks: [
        { name: "Syntax validation", status: "passed", detail: "Static route syntax is valid." },
        {
          name: "Semantic validation",
          status: "warning",
          detail: "Depends on corrected backup WAN addressing.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No duplicate route found for 10.20.0.0/16.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Route changes should be verified against provider handoff documentation.",
        },
      ],
    },
    relatedConfigId: "cfg-juniper-edge",
  },
  {
    id: "finding-fortinet-policy",
    title: "Firewall policy permits all outbound services",
    severity: "high",
    category: "Security / ACL",
    deviceId: "fw-edge-01",
    device: "FW-EDGE-01",
    vendor: "Fortinet",
    location: {
      section: "config firewall policy edit 18",
      lineStart: 15,
      lineEnd: 23,
      ruleName: "outbound-any",
    },
    relevantValue: "srcaddr all, dstaddr all, service ALL",
    evidence: {
      summary: "Policy 18 permits all LAN sources to all WAN destinations using all services.",
      references: [
        { label: "Policy name", value: "outbound-any", line: 16 },
        { label: "Service", value: "ALL", line: 22 },
      ],
    },
    description: "An outbound firewall policy is broader than the expected egress control baseline.",
    whyItMatters:
      "Broad firewall policies reduce segmentation effectiveness and make later incident investigation harder.",
    impact:
      "Unapproved protocols could leave the LAN after deployment.",
    aiExplanation:
      "Static analysis detected an overly broad policy. The AI layer recommends reviewing intended egress services before approving remediation.",
    recommendation:
      "Replace service ALL with approved service groups and restrict destination address objects where possible.",
    confidence: 0.91,
    detectionSources: ["Static Analysis", "Rule Engine"],
    remediation: {
      summary: "Narrow policy 18 to an approved egress service group.",
      currentConfig: ["set srcaddr all", "set dstaddr all", "set service ALL"],
      proposedConfig: [
        "set srcaddr Corp-LAN",
        "set dstaddr Approved-Internet-Services",
        "set service HTTPS DNS NTP",
      ],
      diff: [
        "- set srcaddr all",
        "+ set srcaddr Corp-LAN",
        "- set dstaddr all",
        "+ set dstaddr Approved-Internet-Services",
        "- set service ALL",
        "+ set service HTTPS DNS NTP",
      ],
      riskLevel: "medium",
      approvalRequired: true,
    },
    validation: {
      status: "warning",
      checks: [
        {
          name: "Syntax validation",
          status: "passed",
          detail: "FortiGate policy attributes are syntactically valid.",
        },
        {
          name: "Semantic validation",
          status: "warning",
          detail: "Object names must exist in the target FortiGate policy package.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No policy ordering conflict detected in the mock configuration.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Egress restriction should be reviewed with application owners.",
        },
      ],
    },
    relatedConfigId: "cfg-fortinet-edge",
  },
  {
    id: "finding-http-fortinet",
    title: "HTTP management enabled on DMZ interface",
    severity: "high",
    category: "Management",
    deviceId: "fw-edge-01",
    device: "FW-EDGE-01",
    vendor: "Fortinet",
    location: {
      section: "config system interface edit dmz",
      lineStart: 11,
      interfaceName: "dmz",
    },
    relevantValue: "allowaccess ping http https ssh",
    evidence: {
      summary: "The DMZ interface accepts HTTP management access.",
      references: [{ label: "DMZ allowaccess", value: "ping http https ssh", line: 11 }],
    },
    description: "An interface exposed to DMZ networks allows unencrypted administrative HTTP.",
    whyItMatters:
      "Administrative access should use encrypted protocols and narrowly scoped source controls.",
    impact:
      "Management credentials and session data could be exposed to hosts in the DMZ segment.",
    aiExplanation:
      "The rule engine identified HTTP in the management access list. The recommendation preserves HTTPS and SSH while removing HTTP.",
    recommendation: "Remove HTTP from DMZ interface management access.",
    confidence: 0.97,
    detectionSources: ["Rule Engine"],
    remediation: {
      summary: "Restrict DMZ management protocols to encrypted access.",
      currentConfig: ["set allowaccess ping http https ssh"],
      proposedConfig: ["set allowaccess ping https ssh"],
      diff: ["- set allowaccess ping http https ssh", "+ set allowaccess ping https ssh"],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        { name: "Syntax validation", status: "passed", detail: "Interface allowaccess syntax is valid." },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "HTTPS and SSH remain available for encrypted access.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No dependency on HTTP management found in mock data.",
        },
        {
          name: "Risk assessment",
          status: "passed",
          detail: "Low risk when administrators have HTTPS or SSH access.",
        },
      ],
    },
    relatedConfigId: "cfg-fortinet-edge",
  },
  {
    id: "finding-sonicwall-snmp",
    title: "Weak SNMP community string",
    severity: "medium",
    category: "Management",
    deviceId: "branch-fw-02",
    device: "BRANCH-FW-02",
    vendor: "SonicWall",
    location: {
      section: "settings",
      lineStart: 6,
      ruleName: "snmp community",
    },
    relevantValue: "public",
    evidence: {
      summary: "The SNMP read-only community uses the default value public.",
      references: [{ label: "SNMP community", value: "public ro", line: 6 }],
    },
    description: "Default SNMP communities are easy to guess and often flagged by hardening baselines.",
    whyItMatters:
      "Even read-only SNMP can expose device metadata, interface state, and network structure.",
    impact:
      "An unauthorized actor on a reachable network could enumerate firewall details.",
    aiExplanation:
      "The static rule matched a known weak default. The recommendation is to replace it with an approved community or move to SNMPv3.",
    recommendation: "Replace the public community or use SNMPv3 with authenticated access.",
    confidence: 0.94,
    detectionSources: ["Rule Engine"],
    remediation: {
      summary: "Replace default community with an approved restricted value.",
      currentConfig: ["snmp community public ro"],
      proposedConfig: ["snmp community CS-READONLY-RO ro"],
      diff: ["- snmp community public ro", "+ snmp community CS-READONLY-RO ro"],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        {
          name: "Syntax validation",
          status: "passed",
          detail: "Community string syntax is accepted by the prototype parser.",
        },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Default value is removed.",
        },
        {
          name: "Conflict check",
          status: "warning",
          detail: "Monitoring platform credentials must be updated at the same time.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "Coordinate with NMS owners before deployment.",
        },
      ],
    },
    relatedConfigId: "cfg-sonicwall-branch",
  },
  {
    id: "finding-sonicwall-default-route",
    title: "Default route points to LAN interface",
    severity: "critical",
    category: "Routing",
    deviceId: "branch-fw-02",
    device: "BRANCH-FW-02",
    vendor: "SonicWall",
    location: {
      section: "route-policy",
      lineStart: 16,
      lineEnd: 18,
      ruleName: "default route",
    },
    relevantValue: "gateway 10.80.0.254",
    evidence: {
      summary: "The default route gateway is in the LAN subnet while the WAN interface is configured for DHCP.",
      references: [
        { label: "WAN interface", value: "X1 ip-address dhcp", line: 14 },
        { label: "Default route gateway", value: "10.80.0.254", line: 18 },
      ],
    },
    description: "The default route gateway appears to point inward instead of toward the WAN path.",
    whyItMatters:
      "A firewall default route should normally forward unknown destinations toward the upstream WAN gateway.",
    impact:
      "Internet-bound traffic may fail or hairpin into the LAN after deployment.",
    aiExplanation:
      "Semantic analysis flagged a topology mismatch. The gateway is syntactically valid but inconsistent with the WAN-facing interface model.",
    recommendation:
      "Use the DHCP-provided WAN gateway or confirm an explicit WAN next-hop before approving deployment.",
    confidence: 0.87,
    detectionSources: ["Semantic Analysis", "ML Anomaly Detection"],
    remediation: {
      summary: "Use WAN DHCP gateway for the default route.",
      currentConfig: ["gateway 10.80.0.254"],
      proposedConfig: ["gateway dhcp-interface X1"],
      diff: ["- gateway 10.80.0.254", "+ gateway dhcp-interface X1"],
      riskLevel: "medium",
      approvalRequired: true,
    },
    validation: {
      status: "warning",
      checks: [
        {
          name: "Syntax validation",
          status: "warning",
          detail: "Vendor syntax should be verified against the target SonicWall firmware.",
        },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Default route is associated with the WAN interface after remediation.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No other default route found in the mock export.",
        },
        {
          name: "Risk assessment",
          status: "warning",
          detail: "WAN route changes affect all outbound traffic.",
        },
      ],
    },
    relatedConfigId: "cfg-sonicwall-branch",
  },
  {
    id: "finding-missing-description",
    title: "Missing interface description",
    severity: "low",
    category: "Other",
    deviceId: "core-rtr-01",
    device: "CORE-RTR-01",
    vendor: "Cisco IOS",
    location: {
      section: "interface GigabitEthernet0/0",
      lineStart: 7,
      interfaceName: "GigabitEthernet0/0",
    },
    relevantValue: "Uplink description is present but lacks circuit identifier",
    evidence: {
      summary: "The ISP uplink description does not include a circuit or provider reference.",
      references: [{ label: "Description", value: "Uplink to ISP-A", line: 8 }],
    },
    description: "Interface metadata is incomplete for operational troubleshooting.",
    whyItMatters:
      "Precise interface descriptions reduce mean time to identify ownership and provider paths during incidents.",
    impact: "Operational troubleshooting may take longer during ISP incidents.",
    aiExplanation:
      "The ML anomaly detector marked this description as less specific than similar uplink descriptions in the mock baseline.",
    recommendation: "Add a circuit identifier or provider handoff reference to the interface description.",
    confidence: 0.74,
    detectionSources: ["ML Anomaly Detection"],
    remediation: {
      summary: "Improve interface description metadata.",
      currentConfig: ["description Uplink to ISP-A"],
      proposedConfig: ["description ISP-A DIA CIR-443829 primary uplink"],
      diff: ["- description Uplink to ISP-A", "+ description ISP-A DIA CIR-443829 primary uplink"],
      riskLevel: "low",
      approvalRequired: true,
    },
    validation: {
      status: "passed",
      checks: [
        {
          name: "Syntax validation",
          status: "passed",
          detail: "Description syntax is valid.",
        },
        {
          name: "Semantic validation",
          status: "passed",
          detail: "Operational metadata is more specific.",
        },
        {
          name: "Conflict check",
          status: "passed",
          detail: "No runtime behavior changes.",
        },
        {
          name: "Risk assessment",
          status: "passed",
          detail: "Documentation-only change.",
        },
      ],
    },
    relatedConfigId: "cfg-cisco-core",
  },
];

export const getFindingById = (id: string) => mockFindings.find((finding) => finding.id === id);
