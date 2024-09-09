# Migration
npm run build
npm run typeorm -- migration:run

# Start app
npm run build:swc
sls offline --httpPort 3001
