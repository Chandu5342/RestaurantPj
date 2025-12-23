import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  QrCode, 
  Trash2, 
  Pencil, 
  Check, 
  X,
  Download,
  Users
} from "lucide-react";

export const TableManagement = ({
  tables,
  onAddTable,
  onDeleteTable,
  onUpdateTable,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({ number: 1, capacity: 4, estimatedTime: 15 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ number: 0, capacity: 0, estimatedTime: 0 });
  const [showQR, setShowQR] = useState(null);

  const handleAdd = () => {
    onAddTable({
      number: newTable.number,
      capacity: newTable.capacity,
      estimatedTime: newTable.estimatedTime,
      status: "available",
    });
    setNewTable({ number: newTable.number + 1, capacity: 4, estimatedTime: 15 });
    setShowAddForm(false);
  };

  const handleEdit = (table) => {
    setEditingId(table.id);
    setEditData({ number: table.number, capacity: table.capacity, estimatedTime: table.estimatedTime });
  };

  const handleSaveEdit = (table) => {
    onUpdateTable({ 
      ...table, 
      number: editData.number, 
      capacity: editData.capacity,
      estimatedTime: editData.estimatedTime
    });
    setEditingId(null);
  };

  const handleStatusChange = (table, status) => {
    onUpdateTable({ ...table, status });
  };

  const handleDownloadQR = (table) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      table.qrCode
    )}`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `table-${table.number}-qr.png`;
    link.click();
  };

  return (
    <div className="card-elevated">
      <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">Table Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 sm:p-6 bg-muted/30 border-b border-border">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Table Number</label>
              <input
                type="number"
                value={newTable.number}
                onChange={(e) =>
                  setNewTable({ ...newTable, number: parseInt(e.target.value) || 1 })
                }
                className="input-field w-24"
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Capacity</label>
              <input
                type="number"
                value={newTable.capacity}
                onChange={(e) =>
                  setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })
                }
                className="input-field w-24"
                min={1}
                max={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estimated Time (mins)</label>
              <input
                type="number"
                value={newTable.estimatedTime}
                onChange={(e) =>
                  setNewTable({ ...newTable, estimatedTime: parseInt(e.target.value) || 15 })
                }
                className="input-field w-24"
                min={1}
                max={180}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd}>
                <Check className="w-4 h-4 mr-1" /> Add
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                table.status === "available"
                  ? "border-success/30 bg-success/5"
                  : table.status === "occupied"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-warning/30 bg-warning/5"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {editingId === table.id ? (
                  <input
                    type="number"
                    value={editData.number}
                    onChange={(e) =>
                      setEditData({ ...editData, number: parseInt(e.target.value) || 1 })
                    }
                    className="input-field w-20 text-lg font-bold px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-bold">Table {table.number}</h3>
                )}

                <Badge
                  variant={
                    table.status === "available"
                      ? "success"
                      : table.status === "occupied"
                      ? "destructive"
                      : "warning"
                  }
                >
                  {table.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                {editingId === table.id ? (
                  <input
                    type="number"
                    value={editData.capacity}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        capacity: parseInt(e.target.value) || 2,
                      })
                    }
                    className="input-field w-16 px-2 py-1 text-sm"
                    min={1}
                    max={20}
                  />
                ) : (
                  <span>{table.capacity} seats</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <span className="text-sm">Est. Time: </span>
                {editingId === table.id ? (
                  <input
                    type="number"
                    value={editData.estimatedTime}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        estimatedTime: parseInt(e.target.value) || 15,
                      })
                    }
                    className="input-field w-16 px-2 py-1 text-sm"
                    min={1}
                    max={180}
                  />
                ) : (
                  <span>{table.estimatedTime} mins</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                <button
                  onClick={() => handleStatusChange(table, "available")}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    table.status === "available"
                      ? "bg-success text-success-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Available
                </button>

                <button
                  onClick={() => handleStatusChange(table, "occupied")}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    table.status === "occupied"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Occupied
                </button>

                <button
                  onClick={() => handleStatusChange(table, "reserved")}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    table.status === "reserved"
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Reserved
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQR(showQR === table.id ? null : table.id)}
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR
                </Button>

                {editingId === table.id ? (
                  <>
                    <Button size="sm" variant="gold" onClick={() => handleSaveEdit(table)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(table)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDeleteTable(table.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>

              {showQR === table.id && (
                <div className="mt-4 p-4 bg-white rounded-xl text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      table.qrCode
                    )}`}
                    alt={`QR for Table ${table.number}`}
                    className="mx-auto mb-3"
                  />

                  <p className="text-xs text-muted-foreground mb-2 break-all">
                    {table.qrCode}
                  </p>

                  <Button size="sm" variant="gold" onClick={() => handleDownloadQR(table)}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tables added yet</p>

            <Button className="mt-4" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Table
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
