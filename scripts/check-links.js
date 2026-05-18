#!/usr/bin/env node
/**
 * check-links.js — verifica se todas as URLs do sources.json respondem.
 * Uso: node scripts/check-links.js
 * Node.js 18+ (usa fetch nativo).
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sources = JSON.parse(
  readFileSync(join(__dirname, '../src/data/sources.json'), 'utf8')
)

const TIMEOUT_MS = 10_000
const MAX_CONCURRENT = 5

async function checkUrl(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'hub-entretenimento/link-checker' },
    })
    clearTimeout(timer)
    return { ok: res.ok || res.status === 405, status: res.status }
  } catch (err) {
    clearTimeout(timer)
    const msg = err.name === 'AbortError' ? 'TIMEOUT' : err.message
    return { ok: false, status: msg }
  }
}

async function runBatch(items, concurrency) {
  const results = []
  let i = 0
  async function worker() {
    while (i < items.length) {
      const item = items[i++]
      const { ok, status } = await checkUrl(item.url)
      const icon = ok ? '✅' : '❌'
      console.log(`${icon} [${status}] ${item.name.padEnd(30)} ${item.url}`)
      results.push({ ...item, ok, status })
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}

console.log(`\n🔍 Verificando ${sources.length} URLs...\n`)
const results = await runBatch(sources, MAX_CONCURRENT)

const failed = results.filter((r) => !r.ok)
console.log(`\n${'─'.repeat(60)}`)
console.log(`✅ OK: ${results.length - failed.length}  ❌ Falhas: ${failed.length}`)

if (failed.length > 0) {
  console.log('\nLinks com problema:')
  for (const f of failed) {
    console.log(`  • [${f.status}] ${f.name} — ${f.url}`)
  }
  process.exit(1)
}
