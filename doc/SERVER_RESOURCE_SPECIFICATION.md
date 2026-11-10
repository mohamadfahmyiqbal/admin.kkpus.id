# Server Resource Specification for KKPUS Ecosystem

## Current Environment Analysis

### VPS Production Server (`kkpus.id`)
| Resource | Current | Notes |
|----------|---------|-------|
| OS | Ubuntu 22.04.5 LTS | 5.15.0-202-generic kernel |
| CPU | 1 core | Single-core load |
| RAM | 957MiB total, 220MiB available | 580MiB used |
| Disk | 29G total, 7.6G used (74%) | /dev/vda1 |
| Swap | 3.0Gi | Minimal usage |
| Nginx | 1.18.0 | Reverse proxy ready |
| Node.js | v20.20.2 | Backend runtime |

### Database Configuration
| Setting | Value |
|---------|-------|
| Host | 202.52.147.193 |
| Port | 3306 |
| Database | koperasi |
| User | admin |
| Password | qwerty123!! |

---

## Ideal Resource Requirements

### Small Scale (Current Phase)
- CPU: 2 cores
- Memory: 4 GB
- Disk: 50 GB SSD
- Database memory: 1 GB
- Network: 1 Gbps

### Recommended Production (Next Phase)
- CPU: 4 cores
- Memory: 8 GB
- Disk: 100 GB SSD
- Database memory: 2 GB
- Network: 1 Gbps

### Enterprise Scale (Future Growth)
- CPU: 8 cores
- Memory: 16 GB
- Disk: 200 GB SSD
- Database memory: 4 GB
- Network: 1 Gbps

---

## Detailed Breakdown

### CPU
| Tier | Cores | Use Case | Utilization Target |
|------|-------|----------|-------------------|
| Minimum | 2 | Current operations | 60-70% |
| Recommended | 4 | Production workload | 40-50% |
| Advanced | 8 | High traffic + scaling | 25-35% |

### Memory (RAM)
| Component | Minimum | Recommended | Purpose |
|-----------|---------|-------------|---------|
| API Backend | 512 MB | 1 GB | Node.js process, connection handling |
| Frontend (Member Portal) | 512 MB | 1 GB | React/Vite build, runtime |
| Frontend (Admin Portal) | 512 MB | 1 GB | React/Vite build, runtime |
| Database | 1 GB | 2 GB | Connection pool, query caching, indexing |
| System Buffer | 1 GB | 2 GB | OS caching, application buffer |
| **Total** | **2 GB** | **4 GB** | **Overall requirement** |

### Disk Storage
| Category | Minimum | Recommended | Details |
|----------|---------|-------------|---------|
| Application Code | 500 MB | 1 GB | Source code, dependencies, configs |
| Database | 10 GB | 40 GB | Production data, transaction logs |
| File Uploads | 5 GB | 20 GB | Documents, images, Excel files |
| Logs | 2 GB | 5 GB | Application logs, rotation |
| Backups | 10 GB | 30 GB | Daily/weekly retention (off-site) |
| System | 2 GB | 4 GB | OS, services, cache |
| **Total** | **~30 GB** | **~80 GB** | **Storage requirement** |

---

## Optimized Configuration

### Node.js Optimization
```
--max-old-space-size=4096 \
--enable-source-map \
--experimental-specifier-resolution=node
```

### Database Configuration
```
max_connections: 100
innodb_buffer_pool_size: 2G
query_cache_size: 256M
slow_query_log: ON
```

### Auto-Scaling Configuration
```
minReplicas: 2
maxReplicas: 6
CPU target: 70% utilization
Memory target: 85% utilization
```

---

## Cost Analysis

| Tier | Monthly Cost | Annually | Cost/Benefit |
|------|--------------|----------|--------------|
| Small | $45-60 | $540-720 | Basic operations |
| Recommended | $80-120 | $960-1440 | Production ready |
| Enterprise | $150-250 | $1800-3000 | Scalable architecture |

---

## Implementation Priority

### Phase 1 (Current - Minimum)
- CPU: 2 vCPU
- RAM: 4 GB
- SSD: 50 GB
- Database: MySQL 8.0 (1 GB RAM)

### Phase 2 (Growth - Recommended)
- CPU: 4 vCPU
- RAM: 8 GB
- SSD: 100 GB
- Database: MySQL 8.0 (2 GB RAM)

### Phase 3 (Enterprise - Advanced)
- CPU: 8 vCPU
- RAM: 16 GB
- SSD: 200 GB
- Database: MySQL Cluster (4 GB RAM)

---

## Key Success Metrics

| Metric | Target | Monitoring Tool |
|--------|--------|-----------------|
| API Response Time | < 200ms | New Relic/APM |
| Memory Usage | < 85% | htop/top |
| Database Latency | < 100ms | MySQL Monitor |
| Uptime | 99.9% | Uptime monitoring |
| Error Rate | < 0.5% | Error tracking |

---

## Final Recommendation

**For Immediate Production Deployment:**
- CPU: 2 vCPU cores
- Memory: 4 GB RAM
- Storage: 50 GB SSD
- Network: 1 Gbps
- Database: MySQL 8.0 (1 GB RAM)

**Upgrade Path:**
- Month 1-2: Current setup, monitor, scale to 4 vCPU/8 GB if needed
- Month 3-6: Scale based on growth to 8 vCPU/16 GB if enterprise