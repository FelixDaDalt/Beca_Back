import { autorizados } from '../models/autorizados';
import sequelize from '../config/database';
import { red_colegio } from '../models/red_colegio';
import { Transaction } from "sequelize";

export class BecaService {
    static async altaBeca(idColegio: number|string, idRed:number|string, cantidad: number, transaction: Transaction) {
        try {
            await red_colegio.update(
                {
                    bp: cantidad,
                    btp: sequelize.literal(`${cantidad} + 2`),
                    db: cantidad,
                    dbd: sequelize.literal(`${cantidad} - dbu`),
                    bde: sequelize.literal(`(bp + 2) - bsa - bsp`)
                },
                { where: { id_colegio: idColegio, id_red: idRed }, transaction }
            );
        } catch (error:any) {
            throw new Error(`Error al actualizar matrices de alta de beca: ${error.message}`);
        }
    }

  /**
   * Registra una solicitud de beca.
   * - Incrementa `dbu` en el colegio solicitante.
   * - Incrementa `bsp` en el colegio solicitado.
   * - Recalcula `dbd` en el colegio solicitante.
   * - Recalcula `bde` en el colegio solicitado.
   */

    static async solicitarBeca(idColegioSolicitante: number|string, idColegioSolicitado: number|string, cantidad: number, idRed:number|string, parientesUsados: Map<number, number>, transaction: Transaction) {
        try {

            // Incrementa `dbu` en el colegio solicitante
            await red_colegio.increment({ dbu: cantidad }, { where: { id_colegio: idColegioSolicitante, id_red: idRed }, transaction });

            // Recalcula `dbd`
            await this.actualizarDBD(idColegioSolicitante, idRed, transaction);

            // Incrementa `bsp` en el colegio solicitado
            await red_colegio.increment({ bsp: cantidad }, { where: { id_colegio: idColegioSolicitado, id_red: idRed }, transaction });

            // Recalcula `bde`
            await this.actualizarBDE(idColegioSolicitado, idRed, transaction);

            
            // Incrementa `utilizadas` id_pariente (autorizados)
              for (const [idPariente, cantidad] of parientesUsados.entries()) {
                await autorizados.increment(
                  { utilizadas: cantidad },
                  { where: { id: idPariente }, transaction }
                );
              }
            
        } catch (error:any) {
            throw new Error(`Error al actualizar matrices: ${error.message}`);
        }
    }


  /**
   * Aprueba una beca solicitada.
   * - Incrementa `bsa` en el colegio solicitado.
   * - Decrementa `bsp` en el colegio solicitado.
   * - Recalcula `bde` en el colegio solicitado.
   */
  static async aprobarBeca(idColegioSolicitado: number|string, idRed:number|string, transaction: Transaction) {
    try {
      await red_colegio.increment({ bsa: 1 }, { where: { id_colegio: idColegioSolicitado, id_red:idRed }, transaction });
      await red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: idColegioSolicitado,id_red:idRed }, transaction });

      await this.actualizarBDE(idColegioSolicitado,idRed, transaction);
    } catch (error) {
      console.error("Error al aprobar beca:", error);
      throw error;
    }
  }

  /**
   * Cancela una solicitud de beca antes de su aprobación.
   * - Decrementa `dbu` en el colegio solicitante.
   * - Decrementa `bsp` en el colegio solicitado.
   * - Recalcula `dbd` en el colegio solicitante.
   * - Recalcula `bde` en el colegio solicitado.
   */
  static async rechazarBeca(colegioSolicitante: number|string, colegioSolicitado: number|string,idRed:number|string, idPariente: number, transaction: Transaction) {
    try {
      await red_colegio.decrement({ dbu: 1 }, { where: { id_colegio: colegioSolicitante,id_red:idRed }, transaction });
      await this.actualizarDBD(colegioSolicitante,idRed, transaction);

      await red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: colegioSolicitado, id_red:idRed }, transaction });
      await this.actualizarBDE(colegioSolicitado,idRed, transaction);

      // Decrement `utilizadas` id_pariente (autorizados)
      await autorizados.decrement(
        { utilizadas: 1 },
        { where: { id: idPariente }, transaction }
      );
    } catch (error) {
      console.error("Error al rechazar la beca:", error);
      throw error;
    }
  }

 /**
   * Desestima una solicitud de beca previamente realizada.
   * - Decrementa `dbu` en el colegio solicitante.
   * - Decrementa `bsp` en el colegio solicitado.
   * - Recalcula `dbd` en el colegio solicitante.
   * - Recalcula `bde` en el colegio solicitado.
   */
  static async desestimarBeca(colegioSolicitante: number | string, colegioSolicitado: number | string, idRed: number | string, idPariente: number,transaction: Transaction) {
    try {

        await red_colegio.decrement({ dbu: 1 }, { where: { id_colegio: colegioSolicitante, id_red: idRed }, transaction });
        await this.actualizarDBD(colegioSolicitante, idRed, transaction);

        await red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: colegioSolicitado, id_red: idRed }, transaction });
        await this.actualizarBDE(colegioSolicitado, idRed, transaction);
        await autorizados.decrement(
          { utilizadas: 1 },
          { where: { id: idPariente }, transaction }
        );

    } catch (error) {
        console.error("Error al desestimar beca:", error);
        throw error;
    }
}

  /**
   * Recalcula `dbd = db - dbu`
   */
  private static async actualizarDBD(colegioId: number|string,idRed:number|string, transaction: Transaction) {
    const colegio = await red_colegio.findOne({ where: { id_colegio: colegioId,id_red:idRed }, transaction });

    if (!colegio) throw new Error("Colegio no encontrado");

    const dbd = colegio.db - colegio.dbu;

    await red_colegio.update({ dbd }, { where: { id_colegio: colegioId,id_red:idRed }, transaction });
  }

  /**
   * Recalcula `bde = btp - bsa - bsp`
   */
  private static async actualizarBDE(colegioId: number|string,idRed:number|string, transaction: Transaction) {
    const colegio = await red_colegio.findOne({ where: { id_colegio: colegioId, id_red:idRed }, transaction });

    if (!colegio) throw new Error("Colegio no encontrado");

    const bde = colegio.btp - colegio.bsa - colegio.bsp;

    await red_colegio.update({ bde }, { where: { id_colegio: colegioId, id_red:idRed  }, transaction });
  }
}
