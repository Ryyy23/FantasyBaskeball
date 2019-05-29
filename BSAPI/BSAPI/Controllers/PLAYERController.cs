using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BSAPI.Models;

namespace BSAPI.Controllers
{
    public class PLAYERController : ApiController
    {
        private ballstatsEntities db = new ballstatsEntities();

        // GET: api/PLAYER
        public IQueryable<PLAYER> GetPLAYER()
        {
            return db.PLAYER;
        }

        // GET: api/PLAYER/5
        [ResponseType(typeof(PLAYER))]
        public async Task<IHttpActionResult> GetPLAYER(int id)
        {
            PLAYER pLAYER = await db.PLAYER.FindAsync(id);
            if (pLAYER == null)
            {
                return NotFound();
            }

            return Ok(pLAYER);
        }

        // PUT: api/PLAYER/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPLAYER(int id, PLAYER pLAYER)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pLAYER.ID)
            {
                return BadRequest();
            }

            db.Entry(pLAYER).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PLAYERExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PLAYER
        [ResponseType(typeof(PLAYER))]
        public async Task<IHttpActionResult> PostPLAYER(PLAYER pLAYER)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PLAYER.Add(pLAYER);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = pLAYER.ID }, pLAYER);
        }

        // DELETE: api/PLAYER/5
        [ResponseType(typeof(PLAYER))]
        public async Task<IHttpActionResult> DeletePLAYER(int id)
        {
            PLAYER pLAYER = await db.PLAYER.FindAsync(id);
            if (pLAYER == null)
            {
                return NotFound();
            }

            db.PLAYER.Remove(pLAYER);
            await db.SaveChangesAsync();

            return Ok(pLAYER);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PLAYERExists(int id)
        {
            return db.PLAYER.Count(e => e.ID == id) > 0;
        }
    }
}