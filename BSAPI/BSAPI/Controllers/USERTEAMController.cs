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
    public class USERTEAMController : ApiController
    {
        private ballstatsEntities db = new ballstatsEntities();

        // GET: api/USERTEAM
        public IQueryable<USERTEAM> GetUSERTEAM()
        {
            return db.USERTEAM;
        }

        // GET: api/USERTEAM/5
        [ResponseType(typeof(USERTEAM))]
        public async Task<IHttpActionResult> GetUSERTEAM(string id)
        {
            USERTEAM uSERTEAM = await db.USERTEAM.FindAsync(id);
            if (uSERTEAM == null)
            {
                return NotFound();
            }

            return Ok(uSERTEAM);
        }

        // PUT: api/USERTEAM/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUSERTEAM(string id, USERTEAM uSERTEAM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != uSERTEAM.User)
            {
                return BadRequest();
            }

            db.Entry(uSERTEAM).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!USERTEAMExists(id))
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

        // POST: api/USERTEAM
        [ResponseType(typeof(USERTEAM))]
        public async Task<IHttpActionResult> PostUSERTEAM(USERTEAM uSERTEAM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.USERTEAM.Add(uSERTEAM);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (USERTEAMExists(uSERTEAM.User))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = uSERTEAM.User }, uSERTEAM);
        }

        // DELETE: api/USERTEAM/5
        [ResponseType(typeof(USERTEAM))]
        public async Task<IHttpActionResult> DeleteUSERTEAM(string id)
        {
            USERTEAM uSERTEAM = await db.USERTEAM.FindAsync(id);
            if (uSERTEAM == null)
            {
                return NotFound();
            }

            db.USERTEAM.Remove(uSERTEAM);
            await db.SaveChangesAsync();

            return Ok(uSERTEAM);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool USERTEAMExists(string id)
        {
            return db.USERTEAM.Count(e => e.User == id) > 0;
        }
    }
}