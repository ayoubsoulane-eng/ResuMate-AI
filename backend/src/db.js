import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

/**
 * Database helper for ResuMate AI.
 * Wraps the team-db CLI for shared SQLite via Turso.
 */
class Database {
  /**
   * Execute a SQL query via team-db CLI.
   * Escapes special shell characters ($, backticks, double quotes) that
   * would otherwise be interpreted by the shell (especially $ in bcrypt hashes).
   */
  query(sql) {
    try {
      // MUST escape $ signs — bcrypt hashes contain them and the shell
      // interprets $... inside double quotes as variable expansion.
      const escapedSql = sql
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`')
        .replace(/"/g, '\\"');
      const output = execSync(`team-db "${escapedSql}"`, {
        encoding: 'utf-8',
        timeout: 10000,
      });
      const trimmed = output.trim();
      if (!trimmed) return [];
      // Find the JSON array in the output
      const jsonStart = trimmed.indexOf('[');
      const jsonEnd = trimmed.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) return [];
      return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));
    } catch (err) {
      // If it's a locking error, retry once
      if (err.message?.includes('Locking error') || err.stderr?.includes('Locking error')) {
        return this.query(sql);
      }
      console.error('Database query error:', err.message || err);
      throw err;
    }
  }

  /**
   * Escape a string value for safe use in SQL single-quoted strings.
   */
  escape(val) {
    if (val === null || val === undefined) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  /**
   * Generate a UUID v4.
   */
  generateId() {
    return randomUUID();
  }

  // ---- Users ----

  createUser({ id, email, name, passwordHash }) {
    this.query(
      `INSERT INTO users (id, email, name, password_hash) VALUES (${this.escape(id)}, ${this.escape(email)}, ${this.escape(name)}, ${this.escape(passwordHash)})`
    );
    return this.getUserById(id);
  }

  getUserById(id) {
    const rows = this.query(`SELECT * FROM users WHERE id = ${this.escape(id)}`);
    return rows[0] || null;
  }

  getUserByEmail(email) {
    const rows = this.query(`SELECT * FROM users WHERE email = ${this.escape(email)}`);
    return rows[0] || null;
  }

  // ---- Resumes ----

  createResume({ id, userId, title, content, jobDescription }) {
    this.query(
      `INSERT INTO resumes (id, user_id, title, content, job_description) VALUES (${this.escape(id)}, ${this.escape(userId)}, ${this.escape(title)}, ${this.escape(content)}, ${this.escape(jobDescription)})`
    );
    return this.getResumeById(id);
  }

  getResumeById(id) {
    const rows = this.query(`SELECT * FROM resumes WHERE id = ${this.escape(id)}`);
    return rows[0] || null;
  }

  getResumesByUserId(userId) {
    return this.query(`SELECT * FROM resumes WHERE user_id = ${this.escape(userId)} ORDER BY created_at DESC`);
  }

  updateResume(id, { title, content, jobDescription }) {
    const sets = [];
    if (title !== undefined) sets.push(`title = ${this.escape(title)}`);
    if (content !== undefined) sets.push(`content = ${this.escape(content)}`);
    if (jobDescription !== undefined) sets.push(`job_description = ${this.escape(jobDescription)}`);
    sets.push(`updated_at = CURRENT_TIMESTAMP`);
    this.query(`UPDATE resumes SET ${sets.join(', ')} WHERE id = ${this.escape(id)}`);
    return this.getResumeById(id);
  }

  deleteResume(id) {
    this.query(`DELETE FROM resumes WHERE id = ${this.escape(id)}`);
  }

  // ---- Subscriptions ----

  createSubscription({ id, userId, planType, status, startDate, endDate }) {
    this.query(
      `INSERT INTO subscriptions (id, user_id, plan_type, status, start_date, end_date) VALUES (${this.escape(id)}, ${this.escape(userId)}, ${this.escape(planType)}, ${this.escape(status)}, ${this.escape(startDate)}, ${endDate ? this.escape(endDate) : 'NULL'})`
    );
    return this.getSubscriptionById(id);
  }

  getSubscriptionById(id) {
    const rows = this.query(`SELECT * FROM subscriptions WHERE id = ${this.escape(id)}`);
    return rows[0] || null;
  }

  getActiveSubscriptionByUserId(userId) {
    const rows = this.query(
      `SELECT * FROM subscriptions WHERE user_id = ${this.escape(userId)} AND status = 'active' ORDER BY created_at DESC LIMIT 1`
    );
    return rows[0] || null;
  }

  updateSubscriptionStatus(id, status) {
    this.query(`UPDATE subscriptions SET status = ${this.escape(status)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${this.escape(id)}`);
    return this.getSubscriptionById(id);
  }
}

// Singleton
const db = new Database();
export default db;